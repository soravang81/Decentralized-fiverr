"use client"

import { ArrowLeftRight, LogOut, MapPin, ShoppingCart, UserRoundPen, Users } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { currentRole, isDialog } from "@/lib/recoil/atoms";
import { useRecoilState, useRecoilValue } from "recoil";
import { useCallback, useState } from "react";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Session } from "next-auth";
import { useRole, useUserImage } from "@/lib/recoil/selector";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { updateLastRole } from "@/app/actions/buyer/role";
import { toast } from "sonner";

export function ProfileMenu({session, }:{session : Session }) {
  const role = useRole()
  const img = useUserImage();
  const [currentrole, setCurrentRole] = useRecoilState<UserRole>(currentRole);
  const latestRole = useRole()
  const router = useRouter()

  const toggleRole = useCallback(async() => {
    if (!session) {
      throw new Error("Session is null.");
    }

    const newRole = latestRole === "BUYER" ? "SELLER" : "BUYER";
    const route = newRole === "SELLER" ? "/seller_dashboard" : "/dashboard";
    router.replace(route);
    await updateLastRole({ id: session.user.id, role: newRole })
      .catch((error) => {
        toast.error(error as string);
      });
    setCurrentRole(newRole);
    
  }, [currentrole, setCurrentRole, session]);

  return (
    <div className="flex items-center">
      <DropdownMenu >
        <DropdownMenuTrigger asChild>
          <Avatar className="border">
            {img && <AvatarImage src={img} alt="user" />}
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 self-start flex flex-col">
          <DropdownMenuItem className="p-0"
           >
            <Button variant="ghost" href={role === "BUYER" ? "/profile" : "/seller_dashboard/profile"}className="w-full h-full flex gap-3 justify-start">
              <UserRoundPen size={22} />Profile
            </Button>
          </DropdownMenuItem>

          <DropdownMenuSeparator className=""/>
          <DropdownMenuItem className="p-0 " 
          >
            <Button variant="ghost" onClick={toggleRole} className="w-full h-full flex gap-3 justify-start">
              <Users size={22} />Switch to {role === "BUYER" ? "Seller" : "Buyer"}
            </Button>
          </DropdownMenuItem>
{/* BUYER'S BUTTONS */}
          {role === "BUYER" && <>

            <DropdownMenuSeparator className="md:hidden"/>
            <DropdownMenuItem className="p-0 md:hidden" 
            >
              <Button variant="ghost" href="/orders" className="w-full h-full flex gap-3 justify-start">
                <ArrowLeftRight size={22} />Orders
              </Button>
            </DropdownMenuItem>

          </>}
{/* SELLER'S BUTTONS */}
            {role === "SELLER" && <><DropdownMenuSeparator className="md:hidden"/>
              <DropdownMenuItem className="p-0 md:hidden" 
              >
                <Button variant="ghost" href="/seller_dashboard/orders" className="w-full h-full flex gap-3 justify-start">
                  <ArrowLeftRight size={22} />Orders
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 md:hidden" 
              >
                <Button variant="ghost" href="/seller_dashboard/" className="w-full h-full flex gap-3 justify-start">
                  <MapPin size={22} /> Dashboard
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem className="p-0 md:hidden" 
              >
                <Button variant="ghost" href="/seller_dashboard/gigs" className="w-full h-full flex gap-3 justify-start">
                  <ShoppingCart size={22} />Gigs
                </Button>
              </DropdownMenuItem>
            </>}
{/* ==================== */}
          <DropdownMenuSeparator />
          <DropdownMenuItem className="p-0">
              <Button variant="ghost" onClick={async()=>{await signOut(); }} className="w-full h-full flex gap-3 justify-start">
              <LogOut size={22} />
              Logout
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
