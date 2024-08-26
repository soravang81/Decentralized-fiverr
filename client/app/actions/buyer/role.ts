"use server"

import { UserRole } from "@prisma/client"
import prisma from "@/db/db"

export const getRole = async (id:string) =>{
    const res = await prisma.user.findFirst({
        where : {
            id
        },
        select : {
            role : true
        }
    })
    return res?.role ? res.role : false
}
export const getLastRole = async (id:string) =>{
    const res = await prisma.user.findFirst({
        where : {
            id
        },
        select : {
            lastRole : true
        }
    })
    // console.log(res)
    return res?.lastRole ? res.lastRole : false
}
export const updateLastRole = async ({id,role}:{id:string , role : UserRole}) =>{
    console.log("updating role" + role)
    const res = await prisma.user.update({
        where : {
            id
        },
        data : {
            lastRole : role
        }
    })
    return res?.role ? res.role : false
}