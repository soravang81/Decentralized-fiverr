import { Navbar } from '@/components/navbar';
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { ThemeProvider } from 'next-themes';
import { Suspense } from 'react';
import Loading from '../loading';

export default async function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authConfig);

  return (
    <Suspense fallback={<Loading/>}>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        <div className="min-h-screen text-foreground">
          {/* <Navbar session={session} /> */}
          <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
            {children}
          </div>
        </div>
      </ThemeProvider>
    </Suspense >

  )
}