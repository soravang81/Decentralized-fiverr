"use client"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import Link from "next/link"

export const NavigationBar = () => {
    return (
        <Breadcrumb className="border-b border-slate-300 pb-10">
        <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/seller_dashboard/gigs/create-gig">Gig</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
                <Link href="/seller_dashboard/gigs/create-pricing">Pricing</Link>
            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
        </Breadcrumb>
    )
}