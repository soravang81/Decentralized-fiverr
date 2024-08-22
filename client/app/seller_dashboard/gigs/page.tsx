import { getGigs } from "@/app/actions/seller/gigs";
import { CreateGig } from "@/components/createGig";
import {GigList} from "@/components/sellerGigs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function() {
  const res = await getGigs()

  if(!res) return null;
  
  return <div className="flex flex-col p-8">
    <div className="flex justify-between">
        <h1 className="text-4xl">Gigs</h1>
        <Link href={`/seller_dashboard/gigs/create-gig`}>
          <Button className="flex items-center gap-2 px-4 py-2 text-white">
            <PlusCircle size={20} />
            Create New Gig
          </Button>
        </Link>
    </div>
    <div>
      <GigList gigs={res.gigs}/>
    </div>
  </div>
}