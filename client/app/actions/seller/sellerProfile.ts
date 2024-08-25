"use server"
import prisma from "@/app/db/db"
import { CreateSellerProfileInput } from "@/lib/types"
import { SellerProfile } from "@prisma/client"

export const createSellerProfile = async (data: CreateSellerProfileInput) => {
    try {
        const [sellerProfile, user] = await Promise.all([
            prisma.sellerProfile.create({
                data: {
                    userId: data.userId,
                    name: data.name,
                    description: data.description,
                    subNiche: data.subNiche,
                    website: data.personalWebsite,
                    wallet: data.wallet.toString(),
                    course: data.course,
                    institute: data.institute,
                    startDate: data.startDate,
                    endDate: data.endDate,
                    phoneNumber: data.phoneNumber,
                },
            }),
            prisma.user.update({
                where: { id: data.userId },
                data: { role: "BOTH" },
            }),
        ]);
        return true;
    } catch (err) {
        console.error("Error creating seller profile : ", err);
        return false;
    }
};
export const getSellerProfile = async (id:string) =>{
    try {
        const profile = await prisma.sellerProfile.findUnique({
            where: {
                userId : id,
            },
            select : {
                id : true,
                userId : true,
                name : true,
                description : true,
                subNiche : true,
                website : true,
                wallet : true,
                course : true,
                institute : true,
                startDate : true,
                endDate : true,
                phoneNumber : true,
                profilePicture : true,
                createdAt : true,
                updatedAt : true,
                orders : true,
                // gigs : true
            }
        })
        return profile
    } catch (err) {
        console.error('Error creating seller profile : ', err)
        return false
    }
}
export const updateSellerProfile = async ({ id, data }: { id: string, data: CreateSellerProfileInput }) => {
    try {
        const updateData = Object.fromEntries(
            Object.entries(data).filter(([_, value]) => value !== undefined)
        );

        await prisma.sellerProfile.update({
            where: {
                userId: id,
            },
            data: updateData,
        });

        return true;
    } catch (err) {
        console.error('Error updating seller profile:', err);
        return false;
    }
};

export const getSellerProfileImage = async (id:string) => {
    console.log("inside seller profile")
    try {
        const sp = await prisma.sellerProfile.findFirst({
            where : { userId : id } ,
            select : { profilePicture : true }
        })
        // console.log(sp)
        return sp?.profilePicture
    } catch (err) {
        console.error(err)
        return false
    } 
}