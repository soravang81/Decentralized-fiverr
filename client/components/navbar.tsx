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
        <div className="w-screen border shadow-md text-4xl xl:px-48 lf:px-36 md:px-20 sm:px-6 px-3  py-2 flex justify-between items-center">
            <section className="flex items-center">
                <Link href={"/"} className="p-0"><span className="font-bold">DFiverr</span></Link>
                <NavbarSections session={session}/>
            </section>
            <section className="flex justify-between gap-4 items-center">
                {session && <>
                    <CustomWalletMultiButton/> 
                    {session && <ProfileMenu session={session}  />}
                </>}
                <LoginButton session={session}/>
            </section>  
        </div>
    )
}

export const NavbarSections = ({session}:{session:Session | null}) => {
    return <>
        {session &&<div className="hidden md:flex md:visible gap-4 ml-10">
            <SellerNavbar/>
            <BuyerNavbar/>
        </div>}
    </>
}