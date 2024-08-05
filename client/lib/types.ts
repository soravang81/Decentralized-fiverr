import { Category, Niche, SubNiche } from "./niches";

// Enums
enum UserRole {
    BUYER = 'BUYER',
    SELLER = 'SELLER'
  }
  
export enum OrderStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  DISPUTED = 'DISPUTED'
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
  revisions: number;
  features: string[];
}

export interface CreateGigInput {
  sellerId: string;
  title: string;
  description: string;
  category: Category;
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
  status?: OrderStatus;
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
    revisions: number;
    features: string[];
  }
export interface CreateSellerProfileInput {
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