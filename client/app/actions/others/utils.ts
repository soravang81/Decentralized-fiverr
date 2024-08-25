"use server"

import fs from "fs"

export const getOwnerSecretKey = (): number[] => {
    const WALLET_PATH = process.env.WALLET_PATH || '/home/sourav/.config/solana/id.json';
    const secretKeyString = fs.readFileSync(WALLET_PATH, 'utf8');
    return JSON.parse(secretKeyString);
};
