import { getGigs } from "@/app/actions/seller/gigs";
import { CreateGig } from "@/components/createGig";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link";

export default async function Layout({children,}: Readonly<{ children: React.ReactNode;}>) {

  return <>
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
    </>
}
