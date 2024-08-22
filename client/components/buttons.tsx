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

export const RoleToggleButton = ({ session }: { session: Session | null }) => {
  const [currentrole, setCurrentRole] = useRecoilState<UserRole>(currentRole);
  const router = useRouter();

  const toggleRole = useCallback(async() => {
    if (!session) {
      throw new Error("Session is null.");
    }

    const newRole = currentrole === "BUYER" ? "SELLER" : "BUYER";
    const route = newRole === "SELLER" ? "/seller_dashboard" : "/";
    router.replace(route);
    await updateLastRole({ id: session.user.id, role: newRole })
      .catch((error) => {
        toast.error(error as string);
      });
    setCurrentRole(newRole);

    
  }, [currentrole, setCurrentRole, session]);

  return (
    <Button variant="ghost" onClick={toggleRole}>
      Switch to {currentrole === "BUYER" ? "Seller" : "Buyer"}
    </Button>
  );
};

export const LoginButton = ({session}:{session : Session | null}) => {
    const statusText = session?.user ? "Logout" : "Login";

    return (
        <Button variant={session ? "ghost" : "default"} onClick={()=>!session ? signIn() : signOut()}>{statusText}</Button>
    )
}

const StyledButtonWrapper = styled.div`
  .wallet-adapter-button {
    background-color: #1a1a1a;
    color: white;
    font-family: 'Arial', sans-serif;
    font-size: 16px;
    font-weight: bold;
    padding: 6px 6px;
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
    width : 32px;
    height : 32px;
  }
  .wallet-adapter-button-start-icon {
    width : fit-content;
  }
  &.wallet-adapter-button-trigger {
    background-color: #1a1a1a;
    padding : 16px;
    height : 36px;
  }
  .wallet-adapter-button-end-icon {
    margin-left: 8px;
  }
}
`;

const CustomWalletMultiButton: React.FC = (props) => {
  return (
    <StyledButtonWrapper>
      <WalletMultiButton {...props} />
    </StyledButtonWrapper>
  );
};

export default CustomWalletMultiButton;

