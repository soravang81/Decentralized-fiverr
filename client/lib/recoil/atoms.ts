import { atom } from "recoil";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { UserRole } from "@prisma/client";
import { CreateGigInput, IGetOrders, Message } from "../types";
import { Category, Niche, SubNiche } from "../niches";
import { Client } from "@/app/seller_dashboard/messages/page";

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
export const gigimage = atom<string | null>({
    key: "gigimage",
    default: null
})
export const Orders = atom<IGetOrders[]>({
    key: "Orders",
    default: []
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
export const Messages = atom<Message[]>({
  key: 'Messages', 
  default: []
});
export const currentClient = atom<Client | null>({
  key: 'currentClient', 
  default: null
});
export const chatClients = atom<{active : Client[], inactive : Client[]}>({
  key: 'chatClients', 
  default: {active : [], inactive : []}
});
export const SocketState = atom<any>({
    key: "SocketState",
    default: null
})
