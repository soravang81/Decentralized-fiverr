"use server"
import prisma from "@/app/db/db"
import { authConfig } from "@/lib/auth"
import { CreateEscrowParams, CreateOrderInput } from "@/lib/types"
import { getServerSession } from "next-auth"

export const createOrder = async({order,escrow}:{order:CreateOrderInput , escrow : CreateEscrowParams}) =>{
    const session = await getServerSession(authConfig)
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const odr = await prisma.order.create({
            data : {
                packageId : order.packageId,
                gigId : order.gigId,
                buyerId : session.user.id,
                sellerId : order.sellerId,
                amount : order.amount,
                deadline : order.deadline
            }
        })
        console.log("order id : "+odr.id)
        const esc =  await prisma.escrow.create({
            data: {
                orderId: odr.id,
                address: escrow.address.toString(),
                client: escrow.client.toString(),
                receiver: escrow.receiver.toString(),
                amount: escrow.amount,              
            }
        })
        const trxn = await prisma.transaction.create({
            data : {
                orderId : odr.id,
                txHash : escrow.txHash.toString(),
                fromAddress : escrow.client.toString(),
                toAddress : escrow.address.toString(),
                amount : escrow.amount,
                currency : "SOL",
                status : "PENDING",
                purpose : "BUYER_TO_ESCROW",
            }
        })
        const res = await Promise.all([odr , esc , trxn])
        if(res) return true
    } catch (err) {
        console.error(err)
        return false
    }
}
