"use server"
import prisma from "@/app/db/db"
import { CreateOrderInput, OrderStatus, PaymentStatus } from "@/lib/types"

export const createOrder = async(order:CreateOrderInput) =>{
    try {
        await prisma.order.create({
            data : {
                packageId : order.packageId,
                packageType : order.packageType,
                gigId : order.gigId,
                buyerId : order.buyerId,
                sellerId : order.sellerId,
                amount : order.amount,
                deadline : order.deadline
            }
        })
        return true
    } catch (err) {
        console.error(err)
        return false
    }
}