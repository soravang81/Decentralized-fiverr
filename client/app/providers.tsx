"use client"
import { RoleBasedRedirect } from "@/components/new";
import {SessionProvider} from "next-auth/react"
import { ReactNode } from "react";
import { RecoilRoot } from "recoil";
import { Toaster } from "sonner";

function Providers({ children}:{children : ReactNode}) {
    return (
        <SessionProvider>
            <RecoilRoot>
                <Toaster expand position="top-right"/>
                {children}
            </RecoilRoot>
        </SessionProvider>
    );
   }
   
   export default Providers;
   