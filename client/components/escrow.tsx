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
import { createOrder } from "@/app/actions/buyer/orders";
import { PricingPackage } from "@prisma/client";
import { getSolanaPrice } from "@/lib/utils";

const OWNER_PUBLIC_KEY = new PublicKey("BMbQmugTyuU82vrMrFko4qap293wyK1iyk3toLuBys2D");
const PROGRAM_ID = new PublicKey("GnrHaj1hB4BqKbiWiCWKA6BwkUaF2zmywsaLcGAtTtbj");
const SOLANA_RPC_URL = "https://api.devnet.solana.com"

const InitializeEscrow = ({pkg ,  walletAddress ,sellerId }:{pkg : PricingPackage , sellerId : string,  walletAddress : string}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction , signTransaction } = useWallet();
  const freelancerAddress = walletAddress
  const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log(sellerId)
 

  const handleInitializeEscrow = async () => {
    if (!publicKey) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!freelancerAddress || !pkg.price) {
      toast.error("Please fill in all fields");
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

      const priceInSol = parseFloat(pkg.price.toString()) / await getSolanaPrice();
      const amt = priceInSol * web3.LAMPORTS_PER_SOL
      console.log(amt)
      const tx = await program.methods.initialize(
        publicKey,
        freelancerPubkey,
        new BN(priceInSol * web3.LAMPORTS_PER_SOL)
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

      if (typeof signTransaction === "function") {
        const signedTx = await signTransaction(tx);

        // Send the transaction
        const txHash = await connection.sendRawTransaction(signedTx.serialize(), {
          skipPreflight: true,
        });
        
        // Create the order after the escrow is initialized
        const order = await createOrder({
          order: {
            packageId: pkg.id,
            gigId: pkg.gigId,
            sellerId: sellerId,
            amount: pkg.price,
            deadline: new Date(Date.now() + pkg.deliveryTime * 24 * 60 * 60 * 1000),
          },
          escrow: {
            client: publicKey.toString(),
            receiver: freelancerPubkey.toString(),
            address: escrowKeypair.publicKey.toString(),
            amount: parseFloat(pkg.price.toString()),
            txHash,
          }
        });

        if(!order) throw new Error("Failed to create order");

        setEscrowAddress(escrowKeypair.publicKey.toString());
        toast.success("Escrow initialized successfully!");
      } else {
        throw new Error("Wallet does not support signing transactions");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(`Error initializing escrow: ${error || String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col gap-4 max-w-full flex-wrap">
      <p className="text-red-500 text-xs">Note : Please be aware that you are about to pay in crypto. You will be paying the freelancer this amount and the platform will retain a percentage of the transaction.</p>
      <p className="text-red-500 text-xs">The escrow contract will be created and funded with the amount specified. The freelancer will have access to the funds only after they complete the task.</p>
      <Button onClick={handleInitializeEscrow} disabled={isLoading}>
        {isLoading ? "Processing..." : "Pay"}
      </Button>
      {escrowAddress && (
        <div className="flex max-w-full flex-wrap">
          <h3 className="text-wrap">Address</h3>
          <div className="max-w-full break-words">{escrowAddress}</div>
        </div>
      )}
    </div>
  );
};

export default InitializeEscrow;