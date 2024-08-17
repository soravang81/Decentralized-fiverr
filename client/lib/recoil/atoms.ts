import { atom } from "recoil";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { UserRole } from "@prisma/client";
import { CreateGigInput } from "../types";
import { Category, Niche, SubNiche } from "../niches";

export const currentRole = atom<UserRole>({
    key: "currentRole",
    default: "BUYER",
})
export const Wallet = atom<PhantomWalletAdapter>({
    key: "Wallet",
    default: undefined
})
export const isDialog = atom<boolean>({
    key: "isDialog",
    default: false
})
export const SellerProfileImage = atom<string>({
    key: "SellerProfileImage",
    default: ""
})
export const currentImage = atom<string>({
    key: "currentImage",
    default: ""
})
export const gigform = atom<Omit<CreateGigInput, "sellerId">>({
    key: 'gigform', 
    default: {
      title: '',
      description: '',
      category: '' as Category,
      niche: '' as Niche,
      picture: "",
      subNiche: "" as SubNiche,
      tags: [],
    },
  });