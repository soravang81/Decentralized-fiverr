"use client"

import { toast } from "sonner"
import { cancelOrder, getOrders } from "@/app/actions/buyer/orders";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRecoilState } from "recoil";
import { Orders } from "@/lib/recoil/atoms";
import { Idl, Program, web3 } from "@project-serum/anchor";
import idl from "@/lib/idl.json"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, sendAndConfirmRawTransaction, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { getEscrowAddress } from "@/app/actions/escrow/escrow";
import { Button } from "./ui/button";
import { getOwnerSecretKey } from "@/app/actions/others/utils";
import { createTransaction } from "@/app/actions/others/transaction";
import { IGetOrders } from "@/lib/types";
import useSendEmail from "@/lib/hooks";
cancelOrder
export const CancelOrder = ({order, buyer, seller}:{order: IGetOrders, buyer?: boolean, seller?: boolean}) => {
    const [orders,setOrders] = useRecoilState(Orders)
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const {sendEmail} = useSendEmail()
    const sellerAddress = order.seller.wallet
    const PROGRAM_ID = new PublicKey("53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ");

    const handleCancelOrder = async () => {
      if (!publicKey) {
        toast.error("Wallet not connected");
        return;
      }
    
      try {
        const secretKeyArray = await getOwnerSecretKey();
        const ownerKeys = Keypair.fromSecretKey(Uint8Array.from(secretKeyArray));
    
        console.log("Owner public key:", ownerKeys.publicKey.toBase58());
    
        const program = new Program(idl as Idl, PROGRAM_ID, {
          connection,
          publicKey: ownerKeys.publicKey,
        });
    
        const escrowAddress = await getEscrowAddress(order.id);
        console.log("Escrow address:", escrowAddress);
    
        const escrowAccount = await program.account.escrow.fetch(escrowAddress as string);
        console.log("Escrow account owner:", (escrowAccount as any).owner.toBase58());
    
        // Ensure the owner matches
        if ((escrowAccount as any).owner.toBase58() !== ownerKeys.publicKey.toBase58()) {
          throw new Error("Escrow owner mismatch");
        }
    
        const ix = await program.methods
          .resolveDispute(publicKey)
          .accounts({
            escrow: escrowAddress,
            recipient: buyer ? publicKey : new PublicKey(sellerAddress as string),
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
                  await cancelOrder({orderId : order.id, user : buyer ? "BUYER" : "SELLER"});
                  await createTransaction({
                    txHash : txid,
                    orderId : order.id,
                    status : "CANCELLED",
                    fromAddress : publicKey.toString(),
                    toAddress : publicKey.toString(),
                    purpose : "ESCROW_TO_BUYER_REFUND",
                    currency : "SOL",
                  })
                  await sendEmail({
                    to : buyer ? order.buyer.username : order.seller.user.username ,
                    subject : "Order Cancelled",
                    text : `Hi ${buyer ? order.buyer.name : order.seller.user.name},\n\nYour recent order has been cancelled by ${buyer ? "the buyer ${order.buyer.name}" : "the seller ${order.seller.user.name}"}.\n\nRegards DFiverr.\n\nYou can check your orders from here https://dfiverr.skillcode.website/orders`,
                  })
                  toast.success("Order Cancelled Successfully, your money will be refunded!");
                  // TODO : send mail to the freelancer that the order has been cancelled !
                }
            }
          }
        } catch (error:any) {
          console.log(error)
            const errorMessage = error.message.includes("6002") ? "Invalid address make sure to use the same wallet address that is used to initialize the order" : "Unknown error occurred "+error;
            toast.error("Error cancelling order: " + errorMessage);
            console.log("Error cancelling order:", errorMessage);
        }
      };
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="max-w-fit self-end" >
                Cancel
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will cancel your order and your money will be refunded in a while.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleCancelOrder}>Continue</AlertDialogAction>
            </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}
