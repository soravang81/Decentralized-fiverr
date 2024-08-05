"use server"
import { CreateGigInput } from "@/lib/types"
import prisma from "../../db/db"

export const createGig = async (gig:CreateGigInput) =>{
    try { 
        await prisma.gig.create({
            data : {
                sellerId : gig.sellerId,
                title : gig.title,
                description : gig.description,
                category : gig.category,
                niche : gig.niche,
                subNiche : gig.subNiche,
                tags : gig.tags,
            }
        })
        return true
    } catch (e) {
        console.error(e)
        return false
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
export const editGig = async ({gig , gigId}:{gig:CreateGigInput , gigId : string}) =>{
    try { 
        await prisma.gig.update({
            where : {
                id : gigId
            },
            data : {
                sellerId : gig.sellerId,
                title : gig.title,
                description : gig.description,
                category : gig.category,
                niche : gig.niche,
                subNiche : gig.subNiche,
                tags : gig.tags,
            }
        })
        return true
    } catch (e) {
        console.error(e)
        return false
    }
}