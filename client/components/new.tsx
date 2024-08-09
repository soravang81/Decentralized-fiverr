"use client"
import { getLastRole } from "@/app/actions/buyer/role";
import { currentRole } from "@/lib/recoil/atoms";
import { UserRole } from "@prisma/client";
import { Session } from "next-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTransition } from 'react';

export const RoleBasedRedirect = ({ session , lastRole }: { session: Session | null , lastRole : UserRole }) => {
  const router = useRouter();
  const [role, setRole] = useRecoilState<UserRole>(currentRole);
  const [isPending, startTransition] = useTransition();

  const getRole = async () => {
    if (lastRole) {
      setRole(lastRole);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  useEffect(() => {
    if (session?.user) {
      startTransition(() => {
        if (role === 'SELLER' && window.location.pathname === '/') {
          router.push('/seller_dashboard');
        } else if (role !== 'SELLER' && window.location.pathname === '/seller_dashboard') {
          router.push('/');
        }
      });
    }
  }, [role]);

  return null;
};