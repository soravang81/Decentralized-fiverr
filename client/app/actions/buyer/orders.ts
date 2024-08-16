"use server"
import prisma from "@/app/db/db"
import { CreateEscrowParams, CreateOrderInput } from "@/lib/types"

export const createOrder = async({order,escrow}:{order:CreateOrderInput , escrow : CreateEscrowParams}) =>{
    try {
        const odr = prisma.order.create({
            data : {
                escrowId : order.escrowId,
                packageId : order.packageId,
                packageType : order.packageType,
                gigId : order.gigId,
                buyerId : order.buyerId,
                sellerId : order.sellerId,
                amount : order.amount,
                deadline : order.deadline
            }
        })
        const esc =  prisma.escrow.create({
            data: {
                orderId: escrow.orderId,
                address: escrow.address.toString(),
                client: escrow.client.toString(),
                receiver: escrow.receiver.toString(),
                amount: escrow.amount,              
            }
        })
        await Promise.all([odr , esc])
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}