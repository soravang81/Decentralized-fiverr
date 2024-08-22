"use server"

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getLastRole } from "./buyer/role";
import { getSellerProfileImage } from "./seller/sellerProfile";
import { UserRole } from "@prisma/client";

export async function getImage() {
    const session = await getServerSession(authConfig);
    if (!session?.user?.id) return null;
    // console.log("rolee--------------------"+role)
    const role = await getLastRole(session.user.id);
    console.log(session)
    if (role === "BUYER") return session.user.image;
    return await getSellerProfileImage(session.user.id);
  }
