import { getGigs } from "@/app/actions/seller/gigs";
import { CreateGigButton } from "@/components/createGig";
import GigList from "@/components/gigs";

export default async function() {
  const gigs = await getGigs()
  return <div className="flex flex-col p-8">
    <div className="flex justify-between">
        <h1 className="text-4xl">Gigs</h1>
        <CreateGigButton sellerId={gigs[0].sellerId} />
    </div>
    <div>
      <GigList gigs={gigs}/>
    </div>
  </div>
}