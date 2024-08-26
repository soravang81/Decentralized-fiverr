// "use server"
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
export const editPricingPackage = async (packages: EditPricingPackageInput) => {
    try {
        const updatedPricingPackage = await prisma.pricingPackage.update({
            where: {
                id: packages.id
            },
            data: {
                name: packages.name,
                description: packages.description,
                price: packages.price,
                deliveryTime: packages.deliveryTime,
                features: packages.features
            }
        });
        return updatedPricingPackage;
    } catch (e) {
        console.error(e);
        throw e;
    }   
}
