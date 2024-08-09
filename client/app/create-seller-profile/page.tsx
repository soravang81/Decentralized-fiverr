import { Container } from "@/components/container"
import { NavigationBar } from "@/components/navigationBar"
import PersonalInfo from "@/components/sellerForm"
import { getServerSession } from "next-auth"
import { getLastRole } from "../actions/buyer/role"
import { authConfig } from "@/lib/auth"
import { redirect } from "next/navigation"

   
export default async function SellerProfile () {

    const session = await getServerSession(authConfig)
    const role = session && await getLastRole(session?.user.id)
    console.log()
    role !== "BUYER" ?? redirect("/")
    return (
        <Container className="px-40">
            <NavigationBar/>
            <PersonalInfo/>
        </Container>
    )
}