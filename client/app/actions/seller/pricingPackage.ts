"use server"
import { PricingPackageInput } from "@/lib/types";
import prisma from "../../db/db";

export const createPricingPackage = async (packages: PricingPackageInput) => {
    try {
        await prisma.pricingPackage.create({
            data: {
                gigId: packages.gigId,
                packageType: packages.packageType,
                name: packages.name,
                description: packages.description,
                price: packages.price,
                deliveryTime: packages.deliveryTime,
                features: packages.features
            }
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }   
}