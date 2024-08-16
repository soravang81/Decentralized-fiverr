"use server"

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getLastRole } from "./buyer/role";
import { getSellerProfileImage } from "./seller/sellerProfile";

export async function getImage() {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) return null;
  
    const role = await getLastRole(session.user.id);
    if (role === "BUYER") return session.user.image;
    return await getSellerProfileImage(session.user.id);
  }