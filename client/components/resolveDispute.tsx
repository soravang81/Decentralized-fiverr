"use client"
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
import { toast } from "sonner";
import { Button } from "./ui/button";

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
    
        console.log("Owner public key:", ownerKeys.publicKey.toBase58());
    
        const program = new Program(idl as Idl, PROGRAM_ID, {
          connection,
          publicKey: ownerKeys.publicKey,
        });
    
        const escrowAddress = await getEscrowAddress(dispute.order.id);
        console.log("Escrow address:", escrowAddress);
    
        const escrowAccount = await program.account.escrow.fetch(escrowAddress as string);
        console.log("Escrow account owner:", (escrowAccount as any).owner.toBase58());
    
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
      
          transaction.sign([ownerKeys]);
      
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
                  // TODO : send mail to the freelancer that the dispute has been resolved !
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
          </DialogContent>
        </Dialog>
  }