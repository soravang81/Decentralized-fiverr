// app/actions/escrowActions.ts
'use server'

import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import prisma from "@/db/db"

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
export const createEscrow = async () => {
  
}