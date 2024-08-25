"use client"

import React, { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { toast } from "sonner";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import idl from "../../target/idl/d_fiverr.json"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { BN, Idl, Program, web3 } from "@project-serum/anchor";
import { createEscrowAndTransaction, createOrder } from "@/app/actions/buyer/orders";
import { PricingPackage } from "@prisma/client";
import { getSolanaPrice } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import { createEscrow } from "@/app/actions/escrow/escrow";
import { IGetOrders } from "@/lib/types";

const OWNER_PUBLIC_KEY = new PublicKey("CRiaHeSL2BsokCkHCBSzwPEr2sjMYZdpa1p6w3QSjPxM");
const PROGRAM_ID = new PublicKey("53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ");
const SOLANA_RPC_URL = "https://api.devnet.solana.com"

const InitializeEscrow = ({order }:{order : IGetOrders } ) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction , signTransaction } = useWallet();
  const freelancerAddress = order.seller.wallet
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  // console.log(order.seller.id)
 

  const handleInitializeEscrow = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!freelancerAddress || !order.amount) {
      toast.error("Seller account is not accessible");
      return;
    }
  
    setIsLoading(true);
    try {
      const freelancerPubkey = new PublicKey(freelancerAddress);
      const escrowKeypair = web3.Keypair.generate();
  
      const program = new Program(idl as Idl, PROGRAM_ID, {
        connection,
        publicKey,
      });
  
      const priceInSol = parseFloat((order.amount * order.quantity).toString()) / await getSolanaPrice();
      const amt = priceInSol * web3.LAMPORTS_PER_SOL;
      console.log(amt);
  
      const tx = await program.methods.initialize(
        publicKey,
        freelancerPubkey,
        new BN(amt)
      )
      .accounts({
        escrow: escrowKeypair.publicKey,
        client: publicKey,
        owner: OWNER_PUBLIC_KEY, 
        systemProgram: SystemProgram.programId,
      })
      .transaction();
  
      const { blockhash } = await connection.getLatestBlockhash();
      tx.recentBlockhash = blockhash;
      tx.feePayer = publicKey;
  
      tx.sign(escrowKeypair);
  
      if (typeof signTransaction !== "function") {
        throw new Error("Wallet does not support signing transactions");
      }
  
      const signedTx = await signTransaction(tx);
  
      // Send the transaction
      const txHash = await connection.sendRawTransaction(signedTx.serialize(), {
        skipPreflight: false,
      });
  
      // Wait for transaction confirmation
      const confirmation = await connection.confirmTransaction(txHash, 'confirmed');
      
      if (confirmation.value.err) {
        const txDetails = await connection.getTransaction(txHash, { maxSupportedTransactionVersion: 0 });
        if (txDetails && txDetails.meta && txDetails.meta.logMessages) {
          throw new Error(`Transaction failed: ${txDetails.meta.logMessages.join(', ')}`);
        } else {
          throw new Error("Transaction failed, but no detailed logs available");
        }
      }
  
      // Create the order after the escrow is initialized
      const res = await createEscrowAndTransaction({
        orderId: order.id,
        escrow: {
          client: publicKey.toString(),
          receiver: freelancerPubkey.toString(),
          address: escrowKeypair.publicKey.toString(),
          amount: parseFloat((order.amount * order.quantity).toString()),
          txHash,
        }
      });
  
      if (!res) throw new Error("Failed to create order");
  
      setEscrowAddress(escrowKeypair.publicKey.toString());
      toast.success("Escrow initialized successfully!");
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'object' && error !== null) {
        errorMessage = JSON.stringify(error);
      } else if (typeof error === 'string') {
        errorMessage = error;
      }
      toast.error(`Error initializing escrow: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };
  return  <AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="outline">Pay</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your
        account and remove your data from our servers.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleInitializeEscrow} disabled={isLoading}>
        {isLoading ? "Processing..." : "Continue"}
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>

  // return (
  //   <div className="p-10 flex flex-col gap-4 max-w-full flex-wrap">
  //     <p className="text-red-500 text-xs">Note : Please be aware that you are about to pay in crypto. You will be paying the freelancer this amount and the platform will retain a percentage of the transaction.</p>
  //     <p className="text-red-500 text-xs">The escrow contract will be created and funded with the amount specified. The freelancer will have access to the funds only after they complete the task.</p>
  //     <Button onClick={handleInitializeEscrow} disabled={isLoading}>
  //       {isLoading ? "Processing..." : "Pay"}
  //     </Button>
  //     {escrowAddress && (
  //       <div className="flex max-w-full flex-wrap">
  //         <h3 className="text-wrap">Address</h3>
  //         <div className="max-w-full break-words">{escrowAddress}</div>
  //       </div>
  //     )}
  //   </div>
  // );
};

export default InitializeEscrow;