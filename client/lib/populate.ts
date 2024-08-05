import { createSellerProfile } from "@/app/actions/seller/sellerProfile";
import { Category, Niche, SubNiche } from "../lib/niches"
import { CreateGigInput, CreateOrderInput, CreatePricingPackageInput, CreateSellerProfileInput, PackageType } from "@/lib/types";
import { createGig } from "@/app/actions/seller/gigs";
import { createPricingPackage } from "@/app/actions/seller/pricingPackage";
import { createOrder } from "@/app/actions/buyer/orders";

const sellerProfile:CreateSellerProfileInput = {
  userId : "d8204b70-545a-4a3e-80f5-077171841804",
  skills : ["sdsdf","dsfdsd"],
  languages : ["english", "englishh"],
  bio : "wfwfwf" , 
  category : Category.GraphicsAndDesign,
  niche : Niche.ContentMarketing,
  subNiche : SubNiche.FullStackDevelopment
}
const pricing:CreatePricingPackageInput = {
  gigId : "1f6a648d-a127-4093-a013-016840962288",
  packageType : PackageType.BASIC,
  price : 100,
  name : "myStandard",
  description : "dssdfsdfsd",
  deliveryTime : 3,
  revisions : 0,
  features : ["bakchodi"]
}
const gig:CreateGigInput = {
  sellerId : "e1503c8c-30da-43f2-acca-ddd1e201c731",
  title : "gggggg",
  description : "dddddd",
  category : Category.GraphicsAndDesign,
  niche : Niche.ContentMarketing,
  subNiche : SubNiche.FullStackDevelopment,
  tags : ["#jhjb"]
}
const order:CreateOrderInput = {
  gigId : "1f6a648d-a127-4093-a013-016840962288",
  packageId : "35c99eaf-6e23-4e7b-8709-b9df32689755",
  packageType : PackageType.PREMIUM,
  sellerId : "e1503c8c-30da-43f2-acca-ddd1e201c731",
  buyerId : "d8204b70-545a-4a3e-80f5-077171841804",
  amount : 100,
  deadline : new Date(),
}
  // createSellerProfile(sellerProfile)
  // createGig(gig)
  // createPricingPackage(pricing)
  // createOrder(order)