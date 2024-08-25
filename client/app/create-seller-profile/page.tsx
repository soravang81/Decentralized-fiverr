import { Container } from "@/components/container"
import {PersonalInfo} from "@/components/sellerForm"
import { getServerSession } from "next-auth"
import { getLastRole } from "../actions/buyer/role"
import { authConfig } from "@/lib/auth"
import { redirect } from "next/navigation"

   
export default async function CreateSellerProfile () {

    const session = await getServerSession(authConfig)
    
    return <Container className="px-40">
        {/* <NavigationBar/> */}
        <PersonalInfo session={session}/>
    </Container>
}