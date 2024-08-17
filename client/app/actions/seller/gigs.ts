"use server"
import { CreateGigInput, PricingPackageInput } from "@/lib/types"
import prisma from "../../db/db"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { Gig } from "@prisma/client"

export const createGig = async ({gig, pkg}: {gig: Omit<CreateGigInput,'sellerId'>, pkg: PricingPackageInput[]}) => {
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
                    picture: gig.picture,
                    category: gig.category,
                    niche: gig.niche,
                    subNiche: gig.subNiche,
                    tags: gig.tags,
                }
            });

            await Promise.all(pkg.map(async (pkg) => {
                return prisma.pricingPackage.create({
                    data: {
                        gigId: newGig.id,
                        packageType: pkg.packageType,
                        name: pkg.name,
                        description: pkg.description,
                        price: parseInt(pkg.price),
                        deliveryTime: parseInt(pkg.deliveryTime),
                        features: pkg.features
                    }
                });
            }));

            return newGig;
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
                AND : {
                    sellerId : seller.id,
                    status : "ACTIVE"
                }
            },
            select : {
                id : true,
                title : true,
                sellerId : true,
                description : true,
                status : true,
                picture : true,
                category : true,
                niche : true,
                subNiche : true,
                createdAt : true,
                updatedAt : true,
                tags : true,
            }
        })
        return {
            sellerId : seller.id,
            gigs : gigs
        }
    } catch (e) {
        console.error(e)
        return false
    }
}
export const deleteGig = async (gigIds : string[]) =>{
    try {
        await prisma.gig.updateMany({
            where : {
                id : {
                    in : gigIds
                }
            },
            data: {
                status: "DISCARDED",
            },
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
