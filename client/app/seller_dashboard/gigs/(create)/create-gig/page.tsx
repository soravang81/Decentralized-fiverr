import { getGigs } from "@/app/actions/seller/gigs";
import { CreateGig } from "@/components/createGig";

export default async function() {  
    const gigs = await getGigs();
    if(!gigs) return null;
    return <CreateGig/>
}