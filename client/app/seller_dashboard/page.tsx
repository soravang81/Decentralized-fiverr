import { getServerSession } from "next-auth"
import { getLastRole } from "../actions/buyer/role"
import { authConfig } from "@/lib/auth"
import { redirect } from "next/navigation"

export default async function SellerDashboard () {
    return (
        <div>SellerDashboard</div>
    )
}