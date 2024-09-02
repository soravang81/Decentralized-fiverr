"use client"
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getLastRole, updateLastRole } from "@/app/actions/buyer/role";
import { Session } from "next-auth";
import { Button } from "./ui/button";
import { signIn, signOut } from "next-auth/react";
import { currentRole } from "@/lib/recoil/atoms";
import React, { useCallback, useEffect } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import styled from 'styled-components';
import { useRouter } from "next/navigation";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { useRole } from "@/lib/recoil/selector";
import { replyOrder } from "@/app/actions/buyer/orders";

export const RoleToggleButton = ({ session }: { session: Session | null }) => {
  const [currentrole, setCurrentRole] = useRecoilState<UserRole>(currentRole);
  const latestRole = useRole()
  const router = useRouter();

  // useEffect(() => {
  //   console.log(latestRole)
  //   latestRole && setCurrentRole(latestRole)
  // },[])

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
    <Button variant="ghost" onClick={toggleRole} className="self-center align-middle">
      Switch to {currentrole === "BUYER" ? "Seller" : "Buyer"}
    </Button>
  );
};

export const LoginButton = ({session}:{session : Session | null}) => {
    const statusText = session?.user ? "Logout" : "Login";
    if(session) return null
    return (
        <Button variant="default" className="" onClick={()=>signIn()}>{statusText}</Button>
    )
}

const StyledButtonWrapper = styled.div`
  display: flex;
  align-items: end;
  width : 100%;
  height : fit-content;
  
  .wallet-adapter-dropdown {
    width : 100%;
  positon : absolute;
}

  .wallet-adapter-button {
    width : 100%;
    background-color :#1a1a1a;
    color: white;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 6px 6px;
     @media (max-width: 768px) {
      font-size : 0px;
      padding : 0px
     }
    border-radius: 5px;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #404040;
    transform: translateY(-2px);
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
  }
  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  .wallet-adapter-button-start-icon img {
    height : 32px;
  }
  .wallet-adapter-button-start-icon {
   @media (max-width: 768px) {
   margin : 0px;
    }
  }
  &.wallet-adapter-button-trigger {
    background-color :#1a1a1a;
    color: white;
    @media (max-width: 768px) {
    padding : 4px;
    // height : ;
    }
    width : 100%;
    padding : 16px;
    height : 40px;
    bottom : 0px;
  }
  .wallet-adapter-button-end-icon {
    margin-left: 8px;
  }
}
`;

const CustomWalletMultiButton: React.FC = (props , {e}:{e?:any}) => {
  e && e.preventDefault()
  e && e.stopPropogation()
  return (
    <StyledButtonWrapper>
      <WalletMultiButton  {...props} />
    </StyledButtonWrapper>
  );
};

export default CustomWalletMultiButton;

export const OrderButtons = ({orderId}:{orderId:string}) => {
    return <>
    <Button variant="outline" size="sm" onClick={ async () => {
      await replyOrder({orderId , reply : "ACCEPT"})
      window.location.reload()
    }}>Accept</Button>
    <Button variant="outline" size="sm" onClick={ async () => {
      await replyOrder({orderId , reply : "REJECTED_BY_SELLER"})
      window.location.reload()
    }}>Reject</Button>
    </>
}

