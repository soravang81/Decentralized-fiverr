"use server"
import prisma from "@/db/db"
import { authConfig } from "@/lib/auth"
import { CreateEscrowParams, CreateOrderInput, IGetOrders } from "@/lib/types"
import { OrderStatus } from "@prisma/client"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const createOrder = async({order}:{order:CreateOrderInput}) =>{
    const session = await getServerSession(authConfig)
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        await prisma.order.create({
            data : {
                packageId : order.packageId,
                gigId : order.gigId,
                buyerId : session.user.id,
                quantity : order.quantity,
                sellerId : order.sellerId,
                amount : order.amount,
                deadline : order.deadline
            }
        })
        return true
    } catch (err) {
        console.error(err)
        return err
    }
}

export const createEscrowAndTransaction = async({orderId,escrow}:{orderId : string, escrow : CreateEscrowParams}) => {
    try {
        const esc =  await prisma.escrow.create({
            data: {
                orderId: orderId,
                address: escrow.address.toString(),
                client: escrow.client.toString(),
                receiver: escrow.receiver.toString(),
                amount: escrow.amount,
                transactionId : escrow.txHash.toString(),          
            }
        })
        const trxn = await prisma.transaction.create({
            data : {
                orderId : orderId,
                txHash : escrow.txHash.toString(),
                fromAddress : escrow.client.toString(),
                toAddress : escrow.address.toString(),
                currency : "SOL",
                status : "PENDING",
                purpose : "BUYER_TO_ESCROW",
            }
        })
        await prisma.order.update({
            where : {
                id : orderId
            },
            data : {
                status : "PROCESSING",
                paymentStatus : "HELD_IN_ESCROW"
            }
        })
        const res = await Promise.all([esc , trxn])
        if(res) return true
    } catch (err) {
        console.error(err)
        return false
    }
}
export const replyOrder = async({orderId , reply , status}: {orderId : string , reply? : "ACCEPT" | "REJECT_BY_BUYER" | "REJECTED_BY_SELLER"  , status? : OrderStatus}) => {
    const session = await getServerSession(authConfig)
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        await prisma.order.update({
            where : {
                id : orderId
            },
            data : {
                status : status ? status : reply === "ACCEPT" ? "PAYMENT_PENDING" : reply === "REJECT_BY_BUYER" ? "CANCELLED_BY_BUYER" : "CANCELLED_BY_SELLER",
            }
        })
    } catch (e) {
        throw new Error("Error accepting order : "+e)
    }
}
export const markComplete = async({orderId , user}: {orderId : string , user : "BUYER" | "SELLER"}) => {
    const session = await getServerSession(authConfig)
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const order = await prisma.order.findUnique({
            where : {
                id : orderId
            },
            select : {
                status : true
            }
        })
        if(!order) throw new Error("Order not found")
        if(order.status === "COMPLETED_BY_BUYER" && user === "SELLER" || order.status === "COMPLETED_BY_SELLER" && user === "BUYER") {
            await prisma.order.update({
                where : {
                    id : orderId
                },
                data : {
                    status : "DELIVERED",
                    paymentStatus : "RELEASED",
                    escrow : {
                        update : {
                            status : "COMPLETED"
                        }
                    }
                }
            })
        } else {
            await prisma.order.update({
                where : {
                    id : orderId
                },
                data : {
                    status : user === "BUYER" ? "COMPLETED_BY_BUYER" : "COMPLETED_BY_SELLER"
                }
            })
        }
    } catch (e) {
        throw new Error("Error accepting order : "+e)
    }
}
export const getOrders = async ({ user }: { user: "BUYER" | "SELLER" }): Promise<IGetOrders[]> => {
    const session = await getServerSession(authConfig)

    if (!session) {
        console.error("Unauthorized")
        redirect("/")    
    }
    
    try {
        return await prisma.order.findMany({
            where: user === "BUYER" 
                ? { buyerId: session.user.id }
                : { seller: { userId: session.user.id } },
            include: {
                package: true,
                seller: {
                    include : {
                        user : {
                            select : {
                                name : true,
                                username : true
                            }
                        }
                    }
                },
                gig: true,
            },
        })
    } catch (e) {
        throw new Error("Error fetching orders: " + e)
    }
}
export const cancelOrder = async ({orderId , user } : {orderId : string , user : "BUYER" | "SELLER"}) => {
    const session = await getServerSession(authConfig)
    if (!session) {
        throw new Error("Unauthorized");
    }
    try {
        await prisma.order.update({
            where : {
                id : orderId
            },
            data : {
                status : user === "BUYER" ? "CANCELLED_BY_BUYER" : "CANCELLED_BY_SELLER",
                paymentStatus : "REFUNDED",
                escrow : {
                    update : {
                        where : {
                            orderId
                        },
                        data : {
                            status : "RESOLVED"
                        }
                    }
                }
            }
        })
        return true
    } catch (e) {
        throw new Error("Error cancelling order : "+e)
    }
}
