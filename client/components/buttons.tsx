"use client"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getLastRole, updateLastRole } from "@/app/actions/buyer/role";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { currentRole } from "@/lib/recoil/atoms";
import React, { useCallback, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { useRole } from "@/lib/recoil/selector";
import { replyOrder } from "@/app/actions/buyer/orders";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Badge } from "./ui/badge";
import { getOwnerSecretKey } from "@/app/actions/others/utils";
import { Keypair, PublicKey, sendAndConfirmRawTransaction, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { Idl, Program } from "@project-serum/anchor";
import idl from "@/lib/idl.json"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { getEscrowAddress } from "@/app/actions/escrow/escrow";
import { AdminDisputesResponse, resolveDispute } from "@/app/actions/others/dispute";
import { createTransaction } from "@/app/actions/others/transaction";

export const RoleToggleButton = ({ session }: { session: Session | null }) => {
  const [currentrole, setCurrentRole] = useRecoilState<UserRole>(currentRole);
  const latestRole = useRole()
  const router = useRouter();

  // useEffect(() => {
  //   console.log(latestRole)
  //   latestRole && setCurrentRole(latestRole)
  // },[])

  const toggleRole = useCallback(async() => {
    if (!session) {
      throw new Error("Session is null.");
    }

    const newRole = latestRole === "BUYER" ? "SELLER" : "BUYER";
    const route = newRole === "SELLER" ? "/seller_dashboard" : "/dashboard";
    router.replace(route);
    await updateLastRole({ id: session.user.id, role: newRole })
      .catch((error) => {
        toast.error(error as string);
      });
    setCurrentRole(newRole);
    
  }, [currentrole, setCurrentRole, session]);

  return (
    <Button variant="ghost" onClick={toggleRole} className="self-center align-middle">
      Switch to {currentrole === "BUYER" ? "Seller" : "Buyer"}
    </Button>
  );
};

export const LoginButton = ({session}:{session : Session | null}) => {
    const statusText = session?.user ? "Logout" : "Login";
    if(session) return null
    return (
        <Button variant="default" className="md:block hidden" onClick={()=>signIn()}>{statusText}</Button>
    )
}

const StyledButtonWrapper = styled.div`
  display: flex;
  align-items: end;
  width : 100%;
  height : fit-content;
  
  .wallet-adapter-dropdown {
    width : 100%;
  positon : absolute;
}

  .wallet-adapter-button {
    width : 100%;
    background-color :#1a1a1a;
    color: white;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 6px 6px;
     @media (max-width: 768px) {
      font-size : 0px;
      padding : 0px
     }
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #404040;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .wallet-adapter-button-start-icon img {
    height : 32px;
  }
  .wallet-adapter-button-start-icon {
   @media (max-width: 768px) {
   margin : 0px;
    }
  }
  &.wallet-adapter-button-trigger {
    background-color :#1a1a1a;
    color: white;
    @media (max-width: 768px) {
    padding : 4px;
    // height : ;
    }
    width : 100%;
    padding : 16px;
    height : 40px;
    bottom : 0px;
  }
  .wallet-adapter-button-end-icon {
    margin-left: 8px;
  }
}
`;

const CustomWalletMultiButton: React.FC = (props , {e}:{e?:any}) => {
  e && e.preventDefault()
  e && e.stopPropogation()
  return (
    <StyledButtonWrapper>
      <WalletMultiButton  {...props} />
    </StyledButtonWrapper>
  );
};

export default CustomWalletMultiButton;

export const OrderButtons = ({orderId}:{orderId:string}) => {
    return <>
    <Button variant="outline" size="sm" onClick={ async () => {
      await replyOrder({orderId , reply : "ACCEPT"})
      window.location.reload()
    }}>Accept</Button>
    <Button variant="outline" size="sm" onClick={ async () => {
      await replyOrder({orderId , reply : "REJECTED_BY_SELLER"})
      window.location.reload()
    }}>Reject</Button>
    </>
}

export const DisputeSolveButton = ({dispute} : {dispute : AdminDisputesResponse[0]}) => {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const sellerAddress = dispute.order.seller.wallet
  const PROGRAM_ID = new PublicKey("53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ");

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    try {
      const secretKeyArray = await getOwnerSecretKey();
      const ownerKeys = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
  
      // Verify that ownerKeys.publicKey matches the expected owner
      console.log("Owner public key:", ownerKeys.publicKey.toBase58());
  
      const program = new Program(idl as Idl, PROGRAM_ID, {
        connection,
        publicKey: ownerKeys.publicKey,
      });
  
      const escrowAddress = await getEscrowAddress(dispute.order.id);
      console.log("Escrow address:", escrowAddress);
  
      // Fetch and log the escrow account data
      const escrowAccount = await program.account.escrow.fetch(escrowAddress as string);
      console.log("Escrow account owner:", (escrowAccount as any).owner.toBase58());
  
      // Ensure the owner matches
      if ((escrowAccount as any).owner.toBase58() !== ownerKeys.publicKey.toBase58()) {
        throw new Error("Escrow owner mismatch");
      }
      if(!dispute.order.escrow) throw new Error("Escrow not found");
      if(!sellerAddress) throw new Error("Seller not found");
  
      const ix = await program.methods
        .resolveDispute(publicKey)
        .accounts({
          escrow: escrowAddress,
          recipient: e.target.id === "buyer" ? new PublicKey(dispute.order.escrow.client) : new PublicKey(sellerAddress),
          owner: ownerKeys.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .instruction();
    
        const { blockhash } = await connection.getLatestBlockhash();
    
        const messageV0 = new TransactionMessage({
          payerKey: ownerKeys.publicKey,
          recentBlockhash: blockhash,
          instructions: [ix],
        }).compileToV0Message();
    
        const transaction = new VersionedTransaction(messageV0);
        console.log("Transaction before signing:", transaction);
    
        // Sign the transaction
        transaction.sign([ownerKeys]);
    
        // Send and confirm the transaction
        const rawTransaction = transaction.serialize();
          const txid = await sendAndConfirmRawTransaction(
          connection,
          Buffer.from(rawTransaction),
          {
              maxRetries: 5,
              skipPreflight: true,
          }
          );
          console.log("Transaction sent:", txid);

          // Wait for confirmation
          await connection.confirmTransaction(txid);

          const txDetails = await connection.getTransaction(txid, {
          maxSupportedTransactionVersion: 0,
          });
          console.log(txDetails)
    
        if (txDetails && txDetails.meta && txDetails.meta.logMessages) {
          console.log("Transaction logs:", txDetails.meta.logMessages);
          for (const errorLog of txDetails.meta.logMessages) {
              if (errorLog.includes("success")) {
                try {
                  await resolveDispute({orderId : dispute.order.id, resolution : e.target.id === "buyer" ? "SENT_TO_BUYER" : "SENT_TO_SELLER" , for : e.target.id === "buyer" ? "BUYER" : "SELLER"});
                  await createTransaction({
                    txHash : txid,
                    orderId : dispute.order.id,
                    status : `DISPUTE_RESOLVED_SENT_TO_${e.target.id === "buyer" ? "BUYER" : "SELLER"}`,
                    fromAddress : ownerKeys.publicKey.toString(),
                    toAddress : dispute.order.escrow.address.toString(),
                    purpose : e.target.id === "buyer" ? "ESCROW_TO_BUYER_REFUND" : "ESCROW_TO_SELLER",
                    currency : "SOL",
                  })
                  await 
                  toast.success("Dispute resolved Successfully !")
                } catch (error:any) {
                  toast.error("Error resolving dispute : " + error.message);
                  console.log("Error resolving dispute :", error.message);
                }
                // TODO : send mail to the freelancer that the order has been cancelled !
              }
          }
        }
      } catch (error:any) {
        console.log(error)
          const errorMessage = error.message.includes("6002") ? "Invalid address make sure to use the same wallet address that is used to initialize the order" : "Unknown error occurred "+error;
          toast.error("Error resolving dispute : " + errorMessage);
          console.log("Error resolving dispute :", errorMessage);
      }
  }
  return <Dialog >
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">Resolve</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Dispute Details</DialogTitle>
            <DialogDescription>
              Resolve the dispute between {dispute?.order.buyer.name} and {dispute?.order.seller.name}.
            </DialogDescription>
          </DialogHeader>
              <div className="font-medium flex flex-col gap-2">Dispute Description
                <p>{dispute?.reason}</p>
              </div>
            <div className="flex gap-4">
                <Button id="buyer"  onClick={handleSubmit}>Resolve for Buyer</Button>
                <Button id="seller" variant={"destructive"} onClick={handleSubmit} >Resolve for Seller</Button>
            </div>
                {/* <Button id="seller" variant={"destructive"} onClick={handleClose} >Close this case</Button> */}
        </DialogContent>
      </Dialog>
}