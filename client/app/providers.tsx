"use client"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js";
import {SessionProvider} from "next-auth/react"
import { ReactNode, useMemo } from "react";
import { RecoilRoot } from "recoil";
import { Toaster } from "sonner";

function Providers({ children}:{children : ReactNode}) {
    const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking --
  // Only the wallets you configure here will be compiled into your application
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // Add other wallet adapters here
    ],
    [network]
  );

    return (
        <SessionProvider>
          <RecoilRoot>
            <Toaster expand position="top-right" offset={3} duration={3000}/>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  {children}
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </RecoilRoot>
        </SessionProvider>
    );
   }
   
   export default Providers;
   