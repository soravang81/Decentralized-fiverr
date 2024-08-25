"use server"

import fs from "fs"

export const getOwnerSecretKey = (): number[] => {
    const WALLET_PATH = process.env.NEXT_PUBLIC_OWNER_WALLET || '/home/sourav/.config/solana/id.json';
    const secretKeyString = fs.readFileSync(WALLET_PATH, 'utf8');
    return JSON.parse(secretKeyString);
};
