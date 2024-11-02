"use server"
import prisma from "@/db/db";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth"

export const createChat = async ({receiver ,text }:{
    receiver : string
    text : string
}) => {
    const session = await getServerSession(authConfig)
    if (!session) return null;

    try {
        const res = await prisma.chat.create({
            data : {
                senderId : session.user.id,
                receiverId : receiver,
                text 
            },
            // include : {
            //     sender : true,
            //     receiver : true
            // }
        })
        return res
    } catch (e) {
        console.error("Error creating chat:", e);
        throw e;
    }
}
export const getChat = async (clientId : string) => {
    const session = await getServerSession(authConfig)
    if (!session) throw new Error("Unauthorized");

    try {
        const allChat = await prisma.chat.findMany({
            where : {
                OR : [
                    {
                        senderId : session.user.id,
                        receiverId : clientId
                    },
                    {
                        senderId : clientId,
                        receiverId : session.user.id
                    }
                ]
            },
            include : {
                sender : {
                    select : {
                        id : true,
                        name : true,
                        username : true,
                        profilePicture : true,
                    }
                },
                receiver : {
                    select : {
                        id : true,
                        name : true,
                        username : true,
                        profilePicture : true,
                    }
                }
            }
        })
        const chats = allChat.map((chat) => {
            return {
                id: chat.id,
                text: chat.text,
                senderId: chat.senderId,
                receiverId: chat.receiverId,
                sender : chat.sender,
                receiver : chat.receiver,
                createdAt: chat.createdAt,
                updatedAt: chat.updatedAt,
            }
        })
        return chats
    } catch (e) {
        console.error("Error getting chats:", e);
        throw e;
    }
}