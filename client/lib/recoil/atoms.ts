import { atom } from "recoil";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { UserRole } from "@prisma/client";

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