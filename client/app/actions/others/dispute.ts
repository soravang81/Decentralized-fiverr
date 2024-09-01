"use server"
import prisma from "@/db/db";
import { authConfig } from "@/lib/auth"
import { DisputeResolutions } from "@prisma/client";
import { getServerSession } from "next-auth"

export const raiseDispute = async (data:{
    orderId : string,
    reason : string
}) => {
    const session = await getServerSession(authConfig)
    if(!session) throw new Error("Unauthorized");

    try {
        const escrow = await prisma.escrow.findUnique({
            where : {
                orderId : data.orderId
            }
        })
        if(!escrow) throw new Error("Escrow not found");
        await prisma.dispute.create({
            data: {
                ...data,
                disputedBy : session.user.id             
            }
        })
    } catch (e) {
        console.error("Error raising dispute:", e);
        throw e;
    }
}
export const resolveDispute = async (data:{
    orderId : string,
    resolution : DisputeResolutions
    for : "BUYER" | "SELLER"
})=>{
    const session = await getServerSession(authConfig)
    if(!session) throw new Error("Unauthorized");

    try {
        await prisma.dispute.update({
            where : {
                orderId : data.orderId
            },
            data : {
                resolution : data.resolution
            }
        })
        await prisma.order.update({
            where : {
                id : data.orderId
            },
            data : {
                status : "DISPUTED",
                paymentStatus : data.for === "BUYER" ? "REFUNDED" : "RELEASED"
            }
        })
        await prisma.escrow.update({
            where : {
                orderId : data.orderId
            },
            data : {
                status : "RESOLVED"
            }
        })
    } catch (e) {
        console.error("Error editing dispute:", e);
        throw e;
    }
}
export const getDisputes = async () => {
    const session = await getServerSession(authConfig)
    if(!session) throw new Error("Unauthorized");

    try {
        return await prisma.dispute.findMany({
            where : {
                disputedBy : session?.user.id
            }
        })
    } catch (e) {
        console.error("Error getting disputes:", e);
        throw e;
    }
}
export type AdminDisputesResponse = Awaited<ReturnType<typeof adminDisputes>>;

export const adminDisputes = async () => {
    const session = await getServerSession(authConfig)
    if(!session) throw new Error("Unauthorized");

    try {
        return await prisma.dispute.findMany({
            include : {
                order : {
                    include : {
                        buyer : {
                            select : {
                                name : true,
                            }
                        },
                        seller : {
                            select : {
                                wallet : true,
                                name : true,
                            }
                        },
                        escrow : {
                            select : {
                                address : true,
                                client : true,
                                receiver : true
                            }
                        }
                    }
                },
            }
        })
    } catch (e) {
        console.error("Error getting disputes:", e);
        throw e;
    }
}
