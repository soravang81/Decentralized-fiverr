import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getLastRole } from "../actions/buyer/role";
import { redirect } from "next/navigation";
import { BuyersHomepage } from "@/components/buyersDash";

export default async function BuyersDashboard () {
const session = await getServerSession(authConfig)
  // if (!session) return

  const lastRole = session?.user.id ? await getLastRole(session?.user.id) : console.log("Role not found")
  if (lastRole === "SELLER") {
    redirect("/seller_dashboard")
  }

  return <>
    <BuyersHomepage session={session}/> 
  </>
}
