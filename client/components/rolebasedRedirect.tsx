// "use client"

// import { usePathname, useRouter } from "next/navigation";
// import { useEffect, useCallback, useState } from "react";
// import { useRecoilState } from "recoil";
// import { currentRole } from "@/lib/recoil/atoms";
// import { UserRole } from "@prisma/client";
// import { Session } from "next-auth";

// export function RoleBasedRedirectWrapper({ session, lastRole }: { session: Session | null, lastRole: UserRole }) {
//   const router = useRouter();
//   const [role, setRole] = useRecoilState<UserRole>(currentRole);
//   const pathname = usePathname();
//   const [isInitialLoad, setIsInitialLoad] = useState(true);

//   useEffect(() => {
//     if (lastRole && lastRole !== role) {
//       console.log('Updating role from lastRole:', lastRole);
//       setRole(lastRole);
//     }
//   }, [lastRole, role, setRole]);

//   const performRedirect = useCallback(() => {
//     const isSeller = role === 'SELLER';
//     const isOnSellerDashboard = pathname.startsWith('/seller_dashboard');
//     const isOnBuyerPage = pathname === "/" || !pathname.startsWith("/seller_dashboard")
//     console.log(pathname)

//     console.log('Current path:', pathname);
//     console.log('Is seller:', isSeller);
//     console.log('Is on seller dashboard:', isOnSellerDashboard);
//     console.log('Is on buyer page:', isOnBuyerPage);
//     console.log('Current role:', role);
//     console.log('Session:', session);

//     if (isSeller && !isOnSellerDashboard && !isInitialLoad) {
//       console.log('Redirecting seller to seller dashboard');
//       router.replace('/seller_dashboard');
//     } else if (!isSeller && isOnSellerDashboard && !isInitialLoad) {
//       console.log('Redirecting buyer to home');
//       router.replace('/');
//     } else {
//       console.log('No redirection needed');
//     }

//     if (isInitialLoad) {
//       setIsInitialLoad(false);
//     }
//   }, [role, pathname, router, isInitialLoad]);

//   useEffect(() => {
//     if (session?.user) {
//       console.log('Session detected, performing redirect check');
//       performRedirect();
//     } else {
//       console.log('No session detected');
//     }
//   }, [session, role, performRedirect]);

//   return null;
// }