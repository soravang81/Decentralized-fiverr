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
} = gigData;

  return (
    <div className="container py-10 flex lg:flex-row flex-col gap-10">
      <div className="w-full h-full pr-10 flex flex-col gap-10">
        <h1 className="text-3xl font-bold mb-4 ">{title}</h1>

        <div className="flex gap-4 max-w-full text-wrap flex-wrap">
          <div className="">
          
            {picture && (
              <Image src={picture} alt={title} width={1000} height={100} className="rounded-lg aspect-video mb-4" />
            )}

            <section className="mb-6 mt-10">
              <h2 className="text-2xl font-semibold mb-2">About This Gig</h2>
              <p className="ml-3 text-wrap">{description}</p>
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
        <section className="mt-6 flex flex-col gap-2">
          <h2 className="text-2xl font-semibold mb-2">Additional Information</h2>
          <p className="ml-2">Category: {category}</p>
          <p className="ml-2">Niche: {niche}</p>
          <p className="ml-2">Sub-Niche: {subNiche}</p>
        </section>
      </div>
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-semibold mb-2">Pricings</h2>
        <Tabs defaultValue={pricing[0].name} className="w-96 max-w-full h-fit border rounded-lg p-2 pb-0">
          <TabsList className="w-full">
            {pricing.map((pkg, index) => (
              <TabsTrigger key={index} value={pkg.name} className="w-full">
                {pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}
              </TabsTrigger>
            ))}
          </TabsList>

          {pricing.map((pkg, index) => (
            <TabsContent key={index} value={pkg.name} className="">
              <div className="border rounded-lg p-6 mb-4">
                <h3 className="font-semibold text-2xl p-1">{pkg.name.charAt(0).toUpperCase() + pkg.name.slice(1)}</h3>
                <p className="p-1">{pkg.description}</p>
                <p className="font-bold mt-2 text-xl p-1">${pkg.price}</p>
                <p className="text-lg p-1">Delivery in {pkg.deliveryTime} days</p>
                <div className="flex flex-col gap-2 ml-2">
                  <ol className="p-1 mb-2">
                    {pkg.features.map((feature, index) => <li className="font-semibold" key={index}><span>{index + 1}. </span>{feature}</li>)}
                  </ol>
                </div>
                {pkg && seller.wallet && <BuyOrders pkg={pkg} sellerId={gigData.seller.id} walletAddress={seller.wallet}/>}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
