import { authConfig } from "@/lib/auth"
import { getServerSession } from "next-auth"
import { getLastRole } from "../actions/buyer/role"
import { redirect } from "next/navigation"
import { BuyersHomepage } from "@/components/buyersDash"
import { Navbar } from '@/components/navbar'
import { getGigs } from '@/app/actions/seller/gigs'

export default async function BuyersDashboard() {
	const session = await getServerSession(authConfig)
	// if (!session) {
	// 	redirect("/login")
	// }

	const lastRole = session?.user.id ? await getLastRole(session?.user.id) : null
	if (lastRole === "SELLER") {
		redirect("/seller_dashboard")
	}

	const gigsResult = await getGigs()
  if (!gigsResult) return null

	return (
		<div className="min-h-screen bg-background text-foreground">
				{/* <Navbar session={session} /> */}
				<main className="pt-20">
					<BuyersHomepage session={session} gigs={gigsResult?.gigs || []} />
				</main>
		</div>
	)
}
