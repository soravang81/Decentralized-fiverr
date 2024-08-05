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
        console.error('Error creating seller profile:', err)
        return false
    }
}