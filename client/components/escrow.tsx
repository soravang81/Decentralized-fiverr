'use client'

import React, { useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { toast } from "sonner";
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from "../../target/idl/d_fiverr.json"
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { BN, Idl, Program, web3 } from '@project-serum/anchor';

const OWNER_PUBLIC_KEY = new PublicKey("BMbQmugTyuU82vrMrFko4qap293wyK1iyk3toLuBys2D");
const PROGRAM_ID = new PublicKey("GnrHaj1hB4BqKbiWiCWKA6BwkUaF2zmywsaLcGAtTtbj");
const SOLANA_RPC_URL = "https://api.devnet.solana.com"

const InitializeEscrow = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [freelancerAddress, setFreelancerAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [escrowAddress, setEscrowAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInitializeEscrow = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet');
      return;
    }
    if (!freelancerAddress || !amount) {
      toast.error('Please fill in all fields');
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

      const tx = await program.methods.initialize(
        publicKey,
        freelancerPubkey,
        new BN(web3.LAMPORTS_PER_SOL * parseFloat(amount))
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

      // Add the escrow keypair as a signer
      tx.sign(escrowKeypair);

      const signature = await sendTransaction(tx, connection, { signers: [escrowKeypair] });

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');

      if (confirmation.value.err) {
        throw new Error(`Transaction failed to confirm: ${JSON.stringify(confirmation.value.err)}`);
      }

      setEscrowAddress(escrowKeypair.publicKey.toString());
      toast.success('Escrow initialized successfully!');
    } catch (error) {
      console.error('Error:', error);
      toast.error(`Error initializing escrow: ${error || String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='p-10 flex flex-col gap-4 w-fit'>
      <Label>Receiver address</Label>
      <Input
        type="text"
        placeholder="Freelancer Address"
        value={freelancerAddress}
        onChange={(e) => setFreelancerAddress(e.target.value)}
      />
      <Label>Amount in SOL</Label>
      <Input
        type="number"
        placeholder="Amount in SOL"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <Button onClick={handleInitializeEscrow} disabled={isLoading}>
        {isLoading ? 'Initializing...' : 'Initialize Escrow'}
      </Button>
      {escrowAddress && (
        <div>
          <h3>Escrow Address:</h3>
          <p>{escrowAddress}</p>
        </div>
      )}
    </div>
  );
};

export default InitializeEscrow;