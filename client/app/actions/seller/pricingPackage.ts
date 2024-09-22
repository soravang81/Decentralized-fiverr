"use server"
import { CreatePricingPackageInput, EditPricingPackageInput } from "@/lib/types";
import prisma from "@/db/db"

export const getPricingPackageByGigId = async (gigId: string) => {
    try {
        return await prisma.pricingPackage.findMany({
            where: {
                gigId: gigId
            }
        });
    } catch (error) {
        console.error("Error fetching pricing packages:", error);
        throw error;
    }
}
export const editPricingPackage = async (pkg: EditPricingPackageInput) => {
    try {
        console.log(pkg);
        await prisma.pricingPackage.update({
            where: {
                id: pkg.id
            },
            data: {
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
                deliveryTime: pkg.deliveryTime,
                features: pkg.features
            }
        });
    } catch (e) {
        console.error(e);
        throw e;
    }   
}
