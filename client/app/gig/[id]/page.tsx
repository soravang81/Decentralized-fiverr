import { getGig } from "@/app/actions/seller/gigs";
import Image from 'next/image';
import { $Enums } from '@prisma/client';
import { IGetGigs } from "@/lib/types";
import Loader from "@/components/loader";
import { Suspense } from "react";
import Loading from "../../loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BuyOrders } from "@/components/buyOrders";

export interface IGigExtended extends IGetGigs {
    createdAt : Date ;
    updatedAt : Date ;
}
export default async function GigPageContent({ params }: { params: { id: string } }) {
  const { id } = params;
  const gigData = await getGig(id);
  if (!gigData) return <div>Gig not found</div>;

  const {
    title,
    description,
    picture,
    tags,
    pricing,
    seller,
    category,
    niche,
    subNiche,
    status,
    createdAt,
    updatedAt,
} = gigData;

  return (
    <div className="container py-10 flex">
      <div className="w-full h-full pr-10 flex flex-col gap-10">
        <h1 className="text-3xl font-bold mb-4 ">{title}</h1>

        <div className="flex gap-4">
          <div className="">
          
            {picture && (
              <Image src={picture} alt={title} width={1000} height={100} className="rounded-lg aspect-video mb-4" />
            )}

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">About This Gig</h2>
              <p>{description}</p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span key={index} className="bg-gray-200 rounded-full px-3 py-1 text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </div>

        </div>
          <div className="w-1/3">
            <section>
              <h2 className="text-2xl font-semibold mb-2">About The Seller</h2>
              <div className="flex items-center gap-4">
                <Image src={seller.profilePicture} alt={seller.name} width={60} height={60} className="rounded-full" />
                <div>
                  <h3 className="font-semibold">{seller.name}</h3>
                </div>
              </div>
            </section>
          </div>
        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
          <p>Category: {category}</p>
          <p>Niche: {niche}</p>
          <p>Sub-Niche: {subNiche}</p>
        </section>
      </div>
      <Tabs defaultValue={pricing[0].name}>
        <TabsList aria-label="Pricing packages">
          {pricing.map((pkg, index) => (
            <TabsTrigger key={index} value={pkg.name}>
              {pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>

        {pricing.map((pkg, index) => (
          <TabsContent key={index} value={pkg.name}>
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-semibold">{pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}</h3>
              <p>{pkg.description}</p>
              <p className="font-bold mt-2">${pkg.price}</p>
              <p>Delivery in {pkg.deliveryTime} days</p>
              {pkg && seller.wallet && <BuyOrders pkg={pkg} sellerId={gigData.seller.id} walletAddress={seller.wallet}/>}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
