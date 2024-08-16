import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import Navbar from "@/components/navbar";
import { RoleBasedRedirect } from "@/components/rolebasedRedirect";
import { getServerSession, Session } from "next-auth";
import { authConfig } from "@/lib/auth";
import { getLastRole } from "./actions/buyer/role";
import { UserRole } from "@prisma/client";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Decentralized fiverr",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig)
  // console.log(session)
  const role = session && await getLastRole(session?.user.id)
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar session={session}/>
          <RoleBasedRedirect session={session} lastRole={role as UserRole}/>
          {children}
        </Providers>
      </body>
    </html>
  );
}
