"use client"
import { useRecoilState, useSetRecoilState } from "recoil";
import { updateLastRole } from "@/app/actions/buyer/role";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { UserRole } from "@prisma/client";
import { currentRole } from "@/lib/recoil/atoms";

export const RoleToggleButton = ({ session }: { session: Session }) => {
    const [newRole, setRole] = useRecoilState<UserRole>(currentRole); 

    const roleText = newRole === "BUYER" ? "Switch to Seller" : "Switch to Buyer";

    const handleSetRole = async () => {
        const updatedRole = newRole === "BUYER" ? "SELLER" : "BUYER";
        setRole(updatedRole);
        await updateLastRole({ id: session.user.id, role: updatedRole });
    };

    // useEffect(() => {
    //     const redirectToDashboard = async () => {
    //         if (session?.user) {
    //             await updateLastRole({ id: session.user.id, role: newRole });
    
    //             if (newRole === "SELLER" && window.location.pathname !== "/seller_dashboard") {
    //                 router.push("/seller_dashboard");
    //             } else if (newRole === "BUYER" && window.location.pathname !== "/") {
    //                 router.push("/");
    //             }
    //         }
    //     };
    
    //     redirectToDashboard();
    // }, [newRole, session?.user, router]);

    return (
        <Button variant={"navbar"} onClick={handleSetRole}>
            {roleText}
        </Button>
    );
};

export const LoginButton = ({session}:{session : Session | null}) => {
    const statusText = session?.user ? "Logout" : "Login";

    return (
        <Button variant={session ? "navbar" : "default"} onClick={()=>!session ? signIn() : signOut()}>{statusText}</Button>

    )
}