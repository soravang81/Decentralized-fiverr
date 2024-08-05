"use client"
import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import { useRecoilState } from "recoil";
import { currentRole } from "@/lib/recoil/atoms";

export default function Navbar () {
    const {data : session} = useSession();
    const [role , setRole] = useRecoilState(currentRole)
    
    const statusText = session?.user ? "Logout" : "Login"
    const roleText = role === "Buyer" ? "Switch to Seller" : "Switch to Buyer"

return (
    <div className="w-screen border shadow-md text-3xl px-10 py-2 flex justify-between items-center">
        <span className="font-bold">DFiverr</span>
        <section>
            {session && <Button variant={"navbar"} onClick={()=>setRole(r=>r === "Buyer" ? "Seller" : "Buyer")} >{roleText}</Button>}
            {/* {session && <Button variant={"navbar"} ></Button>} */}
            <Button variant={session ? "navbar" : "default"} onClick={()=>!session ? signIn() : signOut()}>{statusText}</Button>
        </section>  
    </div>
)
}