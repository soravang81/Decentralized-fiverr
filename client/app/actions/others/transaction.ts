"use server"

import prisma from "@/db/db"
import { authConfig } from "@/lib/auth";
import { TransactionPurpose } from "@prisma/client";
import { getServerSession } from "next-auth";

export const createTransaction = async (data: {
    orderId: string
    fromAddress : string,
    toAddress : string
    currency: string
    txHash: string
    status: string
    purpose: TransactionPurpose
}) => {
    const session = await getServerSession(authConfig);
    if(!session) throw new Error("Unauthorized");
    try {
        await prisma.transaction.create({
            data : {
                ...data
            }
        })
    } catch (e) {
        console.error("Error creating transaction:", e);
        throw e;
    }
}