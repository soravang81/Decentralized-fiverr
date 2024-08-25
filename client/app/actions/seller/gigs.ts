"use server"
import { CreateGigInput, CreatePricingPackageInput, IGetGigs, PricingPackageInput } from "@/lib/types"
import prisma from "../../db/db"
import { getServerSession } from "next-auth"
import { authConfig } from "@/lib/auth"
import { Gig } from "@prisma/client"
import { IGigExtended } from "@/app/gig/[id]/page"

export const createGig = async ({gig, pkg}: {gig: Omit<CreateGigInput,'sellerId'>, pkg: CreatePricingPackageInput[]}) => {
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
                        // packageType: pkg.packageType,
                        name: pkg.name,
                        description: pkg.description,
                        price: pkg.price,
                        deliveryTime: pkg.deliveryTime,
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

export const getGig = async (id: string): Promise<IGigExtended | null> => {
    try {
        const gig = await prisma.gig.findUnique({ 
            where: {
                id
            },
            select: {
                id: true,
                title: true,
                sellerId: true,
                description: true,
                status: true,
                picture: true,
                category: true,
                niche: true,
                subNiche: true,
                seller : true,
                pricing : true,
                createdAt : true,
                updatedAt : true,
                tags: true,
            },
        });
        if (!gig) {
            return null;
        }
        return gig;
    } catch (e) {
        console.error("Error fetching gig:", e);
        throw e;
    }
}

export const getGigs = async (id:string): Promise<{gigs: IGetGigs[] } | false> => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const gigs = await prisma.gig.findMany({
            where: {
                AND: {
                    seller : {
                        userId : {
                            not : id
                        }
                    },
                    status: "ACTIVE",
                },
            },
            select: {
                id: true,
                title: true,
                sellerId: true,
                description: true,
                status: true,
                picture: true,
                category: true,
                niche: true,
                subNiche: true,
                seller : true,
                pricing : true,
                tags: true,
            },
        });
        return {gigs}
    } catch (e) {
        console.error(e);
        return false;
    }
};
export const getSellerGigs = async (id:string): Promise<{gigs: IGetGigs[] } | false> => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }
    try {
        const gigs = await prisma.gig.findMany({
            where: {
                AND: {
                    seller : {
                        userId : id
                    },
                    status: "ACTIVE",
                },
            },
            select: {
                id: true,
                title: true,
                sellerId: true,
                description: true,
                status: true,
                picture: true,
                category: true,
                niche: true,
                subNiche: true,
                seller : true,
                pricing : true,
                tags: true,
            },
        });
        return {gigs}
    } catch (e) {
        console.error(e);
        return false;
    }
};
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
