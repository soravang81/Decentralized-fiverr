import { PublicKey } from "@solana/web3.js";
import { Category, Niche, SubNiche } from "./niches";
import { EscrowStatus, EscrowUsers } from "@prisma/client";

// Enums
export enum UserRole {
  BOTH="BOTH",
  BUYER = 'BUYER',
  SELLER = 'SELLER'
}
export type TOrderStatus = {
  PENDING : 'PENDING',
  PROCESSING : 'PROCESSING',
  DELIVERED : 'DELIVERED',
  CANCELLED : 'CANCELLED',
  DISPUTED : 'DISPUTED'
}
export interface CreateEscrowParams {
  // Fields from your Escrow model
  orderId: string;
  address: PublicKey;
  client: PublicKey;
  receiver: PublicKey;
  amount: number;
  status: EscrowStatus;
  sentTo?: EscrowUsers;
  transactionId?: string;
}
export type TEscrowStatus = {
  PENDING : "PENDING"
  COMPLETED : "COMPLETED"
  DISPUTED : "DISPUTED"
  RESOLVED : "RESOLVED"
}
export type TEscrowUsers = {
  CLIENT : "CLIENT", 
  RECEIVER : "RECEIVER"
}
export enum PaymentStatus {
  PENDING = 'PENDING',
  HELD_IN_ESCROW = 'HELD_IN_ESCROW',
  RELEASED = 'RELEASED',
  REFUNDED = 'REFUNDED'
}
export enum PackageType {
  BASIC="BASIC",
  STANDARD="STANDARD",
  PREMIUM="PREMIUM"
}

export enum TransactionPurpose {
  BUYER_TO_ESCROW = 'BUYER_TO_ESCROW',
  ESCROW_TO_SELLER = 'ESCROW_TO_SELLER',
  ESCROW_TO_BUYER_REFUND = 'ESCROW_TO_BUYER_REFUND',
  BUYER_TO_SELLER_TIP = 'BUYER_TO_SELLER_TIP',
  PLATFORM_FEE = 'PLATFORM_FEE'
}

export interface PricingPackageInput {
  gigId: string;
  packageType: PackageType;
  name: string;
  description: string;
  price: number;
  deliveryTime: number;
  // revisions: number;
  features: string[];
}

export interface CreateGigInput {
  sellerId: string;
  title: string;
  description: string;
  category: Category;
  picture: string;
  niche: Niche;
  subNiche: SubNiche;
  revisions?: number;
  tags: string[];
}

export interface CreateOrderInput {
  packageId: string;
  packageType: PackageType;
  gigId: string;
  buyerId: string;
  sellerId: string;
  amount: number;
  deadline: Date;
  status?: TOrderStatus;
  paymentStatus?: PaymentStatus;
}

export interface CreateTransactionInput {
  orderId: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  currency: string;
  txHash: string;
  status: string;
  purpose: TransactionPurpose;
}
  
export interface CreateReviewInput {
  orderId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
}

export interface CreateDisputeInput {
  orderId: string;
  description: string;
  status: string;
}

export interface CreateUserInput {
  username: string;
  sub: string;
  name?: string;
  bio?: string;
  role: UserRole;
  profilePicture?: string;
  password?: string;
  provider: string; // Assuming Provider is a string in your actual implementation
}

export interface CreatePricingPackageInput {
    gigId: string;
    packageType: PackageType;
    name: string;
    description: string;
    price: number;
    deliveryTime: number;
    // revisions: number;
    features: string[];
  }
export interface CreateSellerProfileInput {
  userId: string;
  name : string;
  description : string;
  personalWebsite?: string;
  course? : string,
  wallet : PublicKey | string
  institute? : string;
  startDate?: number;
  endDate?: number;
  phoneNumber?: string;
  profilePicture?: string;
  subNiche?: SubNiche[]
}
export interface UpdateSellerProfileInput {
  userId: string;
  bio?: string;
  skills: string[];
  languages: string[];
  profilePicture?: string;
  category?: Category; // Assuming Category is a string in your actual implementation
  niche?: Niche; // Assuming Niche is a string in your actual implementation
  subNiche?: SubNiche; // Assuming SubNiche is a string in your actual implementation
}

export interface CreateSolWalletInput {
  publicKey: string;
  privateKey: string;
  userId: string;
}