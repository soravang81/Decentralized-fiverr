// import { useState, useEffect, useCallback } from "react";
// import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
// import { toast } from "sonner";

// export const useWallet = () => {
//   const [wallet, setWallet] = useState<PhantomWalletAdapter | null>(null);
//   const [publicKey, setPublicKey] = useState<string | null>(null);

//   useEffect(() => {
//     const loadWallet = async () => {
//       try {
//         const phantomWallet = new PhantomWalletAdapter();
//         setWallet(phantomWallet);
//       } catch (err) {
//         console.error("Failed to initialize wallet:", err);
//         toast.error("Failed to initialize wallet. Is Phantom installed?"+err)
//     }
//     };

//     loadWallet();
//   }, []);

//   const connectWallet = useCallback(async () => {
//     if (wallet) {
//       try {
//         await wallet.connect();
//         const pubKey = wallet.publicKey;
//         if (pubKey) {
//           console.log(pubKey.toString())
//           setPublicKey(pubKey.toString());
//         }
//       } catch (err:any) {
//         console.error(err);
//         toast.error(err.toString())
//     }
//     } else {
//       toast.error("Wallet not initialized. Please refresh the page.");
//     }
//   }, [wallet]);

//   const disconnectWallet = useCallback(async () => {
//     if (wallet) {
//       try {
//         await wallet.disconnect();
//         setPublicKey(null);
//         console.log("disconnectWallet")
        
//         // Re-initialize the wallet adapter to force a fresh connection next time
//         const newWallet = new PhantomWalletAdapter();
//         setWallet(newWallet);
//       } catch (err) {
//         console.error("Failed to disconnect wallet:", err);
//         toast.error("Failed to disconnect wallet !"+err)
//     }
//     }
//   }, [wallet]);

//   return { wallet, publicKey , connectWallet, disconnectWallet };
// };