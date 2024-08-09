"use server"
import prisma from "@/app/db/db"
import { CreateSellerProfileInput } from "@/lib/types"

export const createSellerProfile = async (data : CreateSellerProfileInput) =>{
    try {
        await prisma.sellerProfile.create({
            data: {
                userId : data.userId,
                bio : data.bio,
                skills : data.skills,
                languages : data.languages,
                category : data.category,
                niche : data.niche,
                subNiche : data.subNiche
            }
        })
        return true
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
    try {
        const sp = await prisma.sellerProfile.findFirst({
            where : { userId : id } ,
            select : { profilePicture : true }
        })
        return sp?.profilePicture
    } catch (err) {
        console.error(err)
        return false
    } 
}