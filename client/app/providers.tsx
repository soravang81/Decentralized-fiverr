"use client"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import { clusterApiUrl } from "@solana/web3.js";
import {SessionProvider} from "next-auth/react"
import { ThemeProvider } from "next-themes";
import { ReactNode, useMemo } from "react";
import { RecoilRoot } from "recoil";
import { Toaster } from "sonner";
import Socketwrapper from "./socketwrapper";
import SocketListeners from "./socketListeners";

function Providers({ children }:{children : ReactNode }) {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      // ...more wallet adapters here
    ],
    [network]
  );

    return (
      <ThemeProvider attribute="class" themes={["light", "dark"]} defaultTheme="dark" enableSystem={true}>
        <SessionProvider>
          <RecoilRoot>
            <Toaster expand={false} position="top-right" offset={3} duration={7000}/>
            <ConnectionProvider endpoint={endpoint}>
              <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                  <Socketwrapper>
                    <SocketListeners>
                      {children}
                    </SocketListeners>
                  </Socketwrapper>
                </WalletModalProvider>
              </WalletProvider>
            </ConnectionProvider>
          </RecoilRoot>
        </SessionProvider>
        </ThemeProvider>
    );
   }
   
   export default Providers;
   