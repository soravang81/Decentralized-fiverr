"use client"
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ProfileMenu } from "./profileMenu";
import { LoginButton, RoleToggleButton } from "./buttons";
const CustomWalletMultiButton = dynamic(() => import('@/components/buttons'),{ ssr: false });
import { Session } from "next-auth";
import Link from "next/link";
import dynamic from "next/dynamic";
import { BuyerNavbar, SellerNavbar } from "./roleBasedNavbar";

export const Navbar = ({session}:{session:Session | null}) => {
    const [isScrolled, setIsScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.header 
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b ${
                isScrolled ? 'bg-black bg-opacity-80 backdrop-filter backdrop-blur-lg' : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
                <section className="flex items-center">
                    <Link href={"/dashboard"}>
                        <motion.span 
                            className="text-3xl font-bold bg-clip-text text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.5)]"
                            whileHover={{ scale: 1.05 }}
                        >
                            DFiverr
                        </motion.span>
                    </Link>
                    <NavbarSections session={session}/>
                </section>
                <section className="flex justify-between gap-4 items-center">
                    {session ? (
                        <>
                            <CustomWalletMultiButton/> 
                            <ProfileMenu session={session} />
                        </>
                    ) : (
                        <LoginButton session={session}/>
                    )}
                </section>  
            </nav>
        </motion.header>
    )
}

export const NavbarSections = ({session}:{session:Session | null}) => {
    return (
        <>
            {session && (
                <div className="hidden md:flex md:visible gap-4 ml-10">
                    <SellerNavbar/>
                    <BuyerNavbar/>
                </div>
            )}
        </>
    )
}
