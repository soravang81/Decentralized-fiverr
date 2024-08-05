import { atom } from "recoil";

export const currentRole = atom<"Buyer" | "Seller">({
    key: "currentRole",
    default: "Buyer",
})