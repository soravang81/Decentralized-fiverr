import { getGigs } from "@/app/actions/seller/gigs";
import Loading from "@/app/loading";
import { CreateGig } from "@/components/createGig";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link";
import { Suspense } from "react";

export default async function Layout({children,}: Readonly<{ children: React.ReactNode;}>) {

  return <>
  <Suspense fallback={<Loading/>}>
    <Breadcrumb className="border-b border-slate-300 ">
      <BreadcrumbList className="px-40 py-4">
          <BreadcrumbItem>
          <BreadcrumbLink asChild>
              <Link href="/seller_dashboard/gigs/create-gig">Gig
              </Link>
          </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
          <BreadcrumbLink asChild>
              <Link href="/seller_dashboard/gigs/create-pricing">Pricing
              </Link>
          </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
      </BreadcrumbList>
    </Breadcrumb>
    {children}
    </Suspense>
    </>
}
