// "use client"
import { ProfileMenu } from "./profileMenu";
import { LoginButton, RoleToggleButton } from "./buttons";
const CustomWalletMultiButton = dynamic(() => import('@/components/buttons'),{ ssr: false });
import { Session } from "next-auth";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BuyerNavbar, SellerNavbar } from "./roleBasedNavbar";

export const Navbar = ({session}:{session:Session | null}) => {
    return (
        <div className="w-screen border shadow-md text-3xl px-10 py-2 flex justify-between items-center">
            <section className="flex items-center">
                <Link href={"/"}><span className="font-bold">DFiverr</span></Link>
                <div className="flex gap-4 ml-10">
                    <SellerNavbar/>
                    <BuyerNavbar/>
                </div>
            </section>
            <section className="flex justify-between gap-4 items-center">
                {session && <>
                    <RoleToggleButton session={session}/>
                    <CustomWalletMultiButton/> 
                    {session && <ProfileMenu session={session}  />}
                </>}
                <LoginButton session={session}/>
            </section>  
        </div>
    )
}
