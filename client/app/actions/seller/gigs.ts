"use server"
import { CreateGigInput } from "@/lib/types"
import prisma from "../../db/db"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"

export const createGig = async (gig: CreateGigInput) => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        return await prisma.$transaction(async (prisma) => {
            const seller = await prisma.sellerProfile.findUnique({
                where: { userId: session.user.id },
                select: { id: true }
            });

            if (!seller) {
                throw new Error("Seller profile not found");
            }

            const newGig = await prisma.gig.create({
                data: {
                    sellerId: seller.id,
                    title: gig.title,
                    description: gig.description,
                    category: gig.category,
                    niche: gig.niche,
                    subNiche: gig.subNiche,
                    tags: gig.tags,
                }
            });

            return newGig.id;
        });
    } catch (e) {
        console.error("Error creating gig:", e);
        throw e;
    }
}
export const getGigs = async() => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const seller = await prisma.sellerProfile.findUnique({
            where: { userId: session.user.id },
            select: { id: true }
        });

        if (!seller) {
            throw new Error("Seller profile not found");
        }
        const gigs = await prisma.gig.findMany({
            where: {
                sellerId : seller.id
            },
            select : {
                id : true,
                title : true,
                sellerId : true,
                description : true,
                picture : true,
                category : true,
                niche : true,
                subNiche : true,
                createdAt : true,
                updatedAt : true,
                tags : true,
            }
        })
        return gigs
    } catch (e) {
        console.error(e)
        return []
    }
}
export const deleteGig = async ({gigId , sellerId}:{gigId : string , sellerId : string}) =>{
    try {
        await prisma.gig.delete({
            where : {
                id : gigId
            }
        })
        return true
    } catch (e){
        console.error(e)
        return false
    }
}
export const editGig = async ({ gig, gigId }: { gig: CreateGigInput, gigId: string }) => {
    try {
        const updateData = Object.fromEntries(
            Object.entries(gig).filter(([_, value]) => value !== undefined)
        );

        await prisma.gig.update({
            where: {
                id: gigId,
            },
            data: updateData,
        });

        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};
