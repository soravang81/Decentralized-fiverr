"use server";

import { Client } from "@/app/seller_dashboard/messages/page";
import prisma from "@/db/db";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";

export const getSellerSideClients = async () => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }

    try {
        const res = await prisma.order.findMany({
            where: {
                seller: {
                    userId: session.user.id
                },
            },
            select: {
                buyerId: true,
                buyer: {
                    select: {
                        id: true,
                        name: true,
                        username: true,
                        profilePicture: true,
                    }
                },
                status: true
            },
        });

        const activeStatuses = ["PENDING", "PROCESSING", "PAYMENT_PENDING"];

        const clientsMap = res.reduce((acc: Record<string, Client>, order) => {
            const isActiveOrder = activeStatuses.includes(order.status);

            if (!acc[order.buyerId]) {
                acc[order.buyerId] = {
                    ...order.buyer,
                    isActive: isActiveOrder,
                    lastMessage: "",
                };
            } else {
                acc[order.buyerId].isActive = acc[order.buyerId].isActive || isActiveOrder;
            }

            return acc;
        }, {});

        const lastMessages = await prisma.chat.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: { in: Object.keys(clientsMap) } },
                    { receiverId: session.user.id, senderId: { in: Object.keys(clientsMap) } }
                ]
            },
            orderBy: [
                { createdAt: 'asc'}
            ],
            select: {
                senderId: true,
                receiverId: true,
                text: true,
                createdAt: true, // Keep this for ordering purposes only
            }
        });

        lastMessages.forEach(msg => {
            const clientId = msg.senderId === session.user.id ? msg.receiverId : msg.senderId;
        
            if (clientsMap[clientId]) {
                // If lastMessage is empty or this message is newer, update lastMessage
                if (!clientsMap[clientId].lastMessage) {
                    clientsMap[clientId].lastMessage = msg.text; // Assign the text directly
                } else {
                    // Compare messages based on the order we fetched them
                    clientsMap[clientId].lastMessage = msg.text; // Always update to the latest fetched message text
                }
            }
        });    

        const clients = Object.values(clientsMap);
        const activeClients = clients.filter((client: Client) => client.isActive);
        const inactiveClients = clients.filter((client: Client) => !client.isActive);

        return {
            active: activeClients,
            inactive: inactiveClients,
        };
    } catch (e) {
        console.error("Error fetching clients:", e);
        throw e;
    }
};

export const getBuyerSideClients = async () => {
    const session = await getServerSession(authConfig);
    if (!session || !session.user.id) {
        throw new Error("Unauthorized");
    }

    try {
        const res = await prisma.order.findMany({
            where: {
                buyer: {
                    id: session.user.id
                },
            },
            select: {
                sellerId: true,
                seller: {
                    select: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                username: true,
                                profilePicture: true,
                            }
                        }
                    }
                },
                status: true
            },
        });

        const activeStatuses = ["PENDING", "PROCESSING", "PAYMENT_PENDING"];
        const clientsMap = res.reduce((acc: Record<string, Client>, order) => {
            const isActiveOrder = activeStatuses.includes(order.status);

            if (!acc[order.seller.user.id]) {
                acc[order.seller.user.id] = {
                    ...order.seller.user,
                    isActive: isActiveOrder,
                    lastMessage: "",
                };
            } else {
                acc[order.seller.user.id].isActive = acc[order.seller.user.id].isActive || isActiveOrder;
            }

            return acc;
        }, {});
        
        const lastMessages = await prisma.chat.findMany({
            where: {
                OR: [
                    { senderId: session.user.id, receiverId: { in: Object.keys(clientsMap) } },
                    { receiverId: session.user.id, senderId: { in: Object.keys(clientsMap) } }
                ]
            },
            orderBy: [
                { createdAt: 'desc' }
            ],
            take: 1, // Limit to the most recent message
            select: {
                senderId: true,
                receiverId: true,
                text: true,
                createdAt: true,
            }
        });

        lastMessages.forEach(msg => {
            const clientId = msg.senderId === session.user.id ? msg.receiverId : msg.senderId;
        
            if (clientsMap[clientId]) {
                // If lastMessage is empty or this message is newer, update lastMessage
                if (!clientsMap[clientId].lastMessage) {
                    clientsMap[clientId].lastMessage = msg.text; // Assign the text directly
                } else {
                    // Compare messages based on the order we fetched them
                    clientsMap[clientId].lastMessage = msg.text; // Always update to the latest fetched message text
                }
            }
        });   

        const clients = Object.values(clientsMap);
        const activeClients = clients.filter((client: Client) => client.isActive);
        const inactiveClients = clients.filter((client: Client) => !client.isActive);

        return {
            active: activeClients,
            inactive: inactiveClients,
        };
    } catch (e) {
        console.error("Error fetching clients:", e);
        throw e;
    }
};
