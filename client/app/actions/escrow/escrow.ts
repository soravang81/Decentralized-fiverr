// app/actions/escrowActions.ts
'use server'

import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, web3, BN, Idl } from '@project-serum/anchor';
import idl from "../../../../target/idl/d_fiverr.json"

const OWNER_PUBLIC_KEY = new PublicKey("BMbQmugTyuU82vrMrFko4qap293wyK1iyk3toLuBys2D");
const PROGRAM_ID = new PublicKey("6t7FU5ZA1A38w4tgAPVqR3bYx9CwoctqgPtQ7oFMJtn");
const SOLANA_RPC_URL = "https://api.devnet.solana.com"


export async function initializeEscrow(
  clientPublicKey: string,
  freelancerAddress: string,
  amount: string
) {
  try {
    const connection = new Connection(SOLANA_RPC_URL, 'confirmed');
    const programId = PROGRAM_ID;

    const clientPubkey = new PublicKey(clientPublicKey);
    const freelancerPubkey = new PublicKey(freelancerAddress);
    const escrowKeypair = web3.Keypair.generate();

    const program = new Program(idl as Idl, programId, {
      connection,
      publicKey: clientPubkey,
    } as any);

    const instruction = await program.methods.initialize(
      clientPubkey,
      freelancerPubkey,
      new BN(web3.LAMPORTS_PER_SOL * parseFloat(amount))
    )
    .accounts({
      escrow: escrowKeypair.publicKey,
      client: clientPubkey,
      owner: OWNER_PUBLIC_KEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: SystemProgram.programId,
    })
    .instruction();

    // Return the instruction data, escrow public key, and escrow secret key
    return {
      instructionData: {
        programId: instruction.programId.toBase58(),
        keys: instruction.keys.map(key => ({
          pubkey: key.pubkey.toBase58(),
          isSigner: key.isSigner,
          isWritable: key.isWritable
        })),
        data: Buffer.from(instruction.data).toString('base64')
      },
      escrowPublicKey: escrowKeypair.publicKey.toBase58(),
      escrowSecretKey: Buffer.from(escrowKeypair.secretKey).toString('base64'),
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}