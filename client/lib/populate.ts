import { createSellerProfile } from "@/app/actions/seller/sellerProfile";
import { Category, Niche, SubNiche } from "../lib/niches"
import { CreateGigInput, CreateOrderInput, CreatePricingPackageInput, CreateSellerProfileInput, PackageType } from "@/lib/types";
import { createGig } from "@/app/actions/seller/gigs";
// import { createPricingPackage } from "@/app/actions/seller/pricingPackage";
import { createOrder } from "@/app/actions/buyer/orders";
import { PublicKey } from "@solana/web3.js";

export const dummysellerProfile:CreateSellerProfileInput = {
  userId : "8b7e45c9-b65d-4676-b3fd-570b2756c8c7",
  name : "sellerName",
  description : "sellerDescription",
  wallet : "sdfs",
  personalWebsite : "www.example.com",
  course : "courseName",
  institute : "instituteName",
  subNiche : [SubNiche.FullStackDevelopment]
}
export const dummypricing:CreatePricingPackageInput = {
  // gigId : "02e824fa-c464-4a9d-be05-beaf002cf46f",
  // packageType : PackageType.BASIC,
  price : 100,
  name : "myStandard",
  description : "dssdfsdfsd",
  deliveryTime : 3,
  features : ["bakchodi"]
}
export const dummygig:CreateGigInput = {
  title : "gggggg",
  description : "dddddd",
  picture : "dsfsdf",
  category : Category.GraphicsAndDesign,
  niche : Niche.ContentMarketing,
  subNiche : SubNiche.FullStackDevelopment,
  tags : ["#jhjb"]
}
export const dummyorder:CreateOrderInput = {
  gigId : "02e824fa-c464-4a9d-be05-beaf002cf46f",
  packageId : "defd59f3-7a9f-4043-9f20-4f66a5eb9798",
  packageType : PackageType.PREMIUM,
  sellerId : "ad22298c-6f9e-4cbe-b437-4d79ed2d989b",
  buyerId : "8b7e45c9-b65d-4676-b3fd-570b2756c8c7",
  amount : 100,
  deadline : new Date(),
}
  // createSellerProfile(sellerProfile)
  // createGig({gig : dummygig , pkg : [dummypricing]})
  // createGig(dummypricing)
  createOrder({order : dummyorder , escrow : {address : new PublicKey("0xsdfsf0") , client : ("0xsdfsf0" as unknown as PublicKey) , receiver : ("0xsdfsf0"  as unknown as PublicKey) , amount : 100}})