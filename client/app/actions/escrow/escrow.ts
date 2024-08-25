// app/actions/escrowActions.ts
'use server'

import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { Program, web3, BN, Idl } from '@project-serum/anchor';
import idl from "../../../../target/idl/d_fiverr.json"
import prisma from '@/app/db/db';

const OWNER_PUBLIC_KEY = new PublicKey("BMbQmugTyuU82vrMrFko4qap293wyK1iyk3toLuBys2D");
const PROGRAM_ID = new PublicKey("53f9PzxmMi2ztWzTvM1pNgJXhhxyuPNCMNk6y9DPfELZ");
const SOLANA_RPC_URL = "https://api.testnet.solana.com"


export const getEscrowAddress = async (orderId : string) => {
  try {
    const escrow = await prisma.escrow.findUnique({
      where : {
        orderId : orderId
      }
    })
    return escrow?.address
  } catch(e){
    throw new Error("Error getting escrow address : "+e)
  }
}