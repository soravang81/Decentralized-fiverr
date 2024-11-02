"use server"

import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getLastRole } from "../buyer/role";
import { getSellerProfileImage } from "../seller/sellerProfile";
import { UserRole } from "@prisma/client";

export async function getImage() {
    const session = await getServerSession(authConfig);
    // console.log(session)
    if (!session?.user?.id) return null;
    const role = await getLastRole(session.user.id);
    // console.log(session)
    if (role === "BUYER" || role === "ADMIN") return session.user.image;
    else return await getSellerProfileImage(session.user.id);
  }
