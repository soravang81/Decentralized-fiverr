"use client"
import { Trash } from "lucide-react"
import { toast } from "sonner"
import { cancelOrder, getOrders, markComplete, replyOrder } from "@/app/actions/buyer/orders";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useRecoilState } from "recoil";
import { Orders } from "@/lib/recoil/atoms";
import { Idl, Program, web3 } from "@project-serum/anchor";
import {IDL , DFiverr} from "../../target/types/d_fiverr"
import idl from "../../target/idl/d_fiverr.json"
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, PublicKey, sendAndConfirmRawTransaction, sendAndConfirmTransaction, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { getEscrowAddress } from "@/app/actions/escrow/escrow";
import { Button } from "./ui/button";
import { getOwnerSecretKey } from "@/app/actions/others/utils";
import { createTransaction } from "@/app/actions/others/transaction";
import { Order } from "@prisma/client";
import { IGetOrders } from "@/lib/types";

export const MarkComplete = ({order, client, freelancer}:{order: IGetOrders, client?: boolean, freelancer?: boolean}) => {
    const { connection } = useConnection();
    const { publicKey, signTransaction } = useWallet();
    const PROGRAM_ID = new PublicKey("53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ");

    const handleMarkComplete = async () => {
      console.log(order,order.id)
      const sellerAddress = order.seller.wallet
      console.log(sellerAddress)
        if (!publicKey) {
          toast.error("Wallet not connected");
          return;
        }
        if(!sellerAddress) {
          toast.error("Seller address not found");
          return
        }
        try {
          const program = new Program(idl as Idl, PROGRAM_ID, {
            connection,
            publicKey,
          });
          const escrowAddress = await getEscrowAddress(order.id);
          if(!escrowAddress) throw new Error("Escrow address not found");
          console.log("Escrow address:", escrowAddress);
      
          const tx = await program.methods
            .markCompleted(client ? "client" : "freelancer")
            .accounts({
              escrow: escrowAddress,
              signer: publicKey,
              freelancer : client ? new PublicKey(sellerAddress) : publicKey, //ensure use same account
              systemProgram : SystemProgram.programId
            })
            .instruction();
      
          const { blockhash } = await connection.getLatestBlockhash();
          const messageV0 = new TransactionMessage({
            payerKey: publicKey,
            recentBlockhash: blockhash,
            instructions: [tx],
          }).compileToV0Message();

          const transaction = new VersionedTransaction(messageV0);
      
          if (typeof signTransaction === "function") {
            const signedTx = await signTransaction(transaction);
      
            // Send the transaction
            const txid = await connection.sendRawTransaction(signedTx.serialize(), {
              skipPreflight: true,
            });
            console.log(txid)
            
            // Wait for transaction confirmation
            await connection.confirmTransaction(txid);
            const txDetails = await connection.getTransaction(txid, {
              maxSupportedTransactionVersion: 0,
              });
              console.log(txDetails)

            if (txDetails && txDetails.meta && txDetails.meta.logMessages) {
              console.log("Transaction logs:", txDetails.meta.logMessages);
              txDetails.meta.logMessages.map(async(errorLog , index) => {
                if(errorLog === "Program 53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ success") {
                  // Update order status
                  await createTransaction({
                    txHash: txid,
                    orderId: order.id,
                    status: `MARKED_COMPLETE_BY_${client ? "CLIENT" : "FREELANCER"}`,
                    fromAddress: publicKey.toString(),
                    toAddress: escrowAddress.toString(),
                    purpose: "PLATFORM_FEE",
                    currency: "SOL",
                  });
                  await markComplete({orderId : order.id, user : client ? "BUYER" : "SELLER" });
                  toast.success("Order marked as complete successfully!");
                  // TODO: send mail to the buyer that the order has been marked as complete
                  return;
                }
              })
            // throw new Error("Transaction did not complete successfully"+ txDetails.meta.logMessages);
            }
            
          } else {
            throw new Error("Wallet does not support signing transactions");
          }
        } catch (error:any) {
          console.log(error)
            const errorMessage = error.message.includes("6002") ? "Invalid address make sure to use the same wallet address that is used to initialize the order" : "Unknown error occurred "+error;
            toast.error("Error marking order as complete: " + errorMessage);
            console.log("Error marking order as complete:", errorMessage);
        }
}
    return <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="max-w-fit self-end" >
                Mark complete
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will mark your order as completed and the buyer will verify it before you receive money.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleMarkComplete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
}
