import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
// import fs from "fs"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function getSolanaPrice() {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd');
    const data = await response.json();
    const solPrice = data.solana.usd;
    console.log(`Current Solana price: $${solPrice}`);
    return solPrice;
}
export const getTimeDifference = (createdAt: Date | string): string => {
  const createdAtDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;

  const timeDifference = Date.now() - createdAtDate.getTime();

  const minutes = Math.floor(timeDifference / (1000 * 60));

  if (minutes < 1) {
    return 'now';
  }
  else if (minutes < 5) {
    return 'few mins ago';
  }
  else if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  }
  else if (minutes < 1440) {
    return `${Math.floor(minutes / 60)} hr${Math.floor(minutes / 60) > 1 ? 's' : ''} ago`;
  }
  else {
    return `${Math.floor(minutes / 1440)}d${Math.floor(minutes / 1440) > 1 ? 's' : ''} ago`;
  }
};