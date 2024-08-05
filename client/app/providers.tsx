"use client"
import {SessionProvider} from "next-auth/react"
import { ReactNode } from "react";
import { RecoilRoot } from "recoil";

function Providers({ children}:{children : ReactNode}) {
    return (
        <SessionProvider>
            <RecoilRoot>
                {children}
            </RecoilRoot>
        </SessionProvider>
    );
   }
   
   export default Providers;
   