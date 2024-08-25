import { Card, CardContent } from "./ui/card"
import { Avatar, AvatarImage } from "./ui/avatar"
import { IGetGigs } from "@/lib/types"
import { Star } from "lucide-react"
import { redirect } from "next/navigation"
import Link from "next/link"

export const BuyerGigs = ({gigs}:{gigs:IGetGigs[]}) => {

    return (
        <div className="container py-10">
        <h1 className="text-4xl font-semibold">Explore Gigs</h1>
        <div className=" py-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-cols-fr items-start">
            {gigs.map((gig, index) => (
                <Card key={gig.id} className="w-full p-2 hover:scale-105 transition-transform ease-in-out">
                    <CardContent className="w-full flex flex-col gap-2 p-1">
                        <img src={gig.picture || ""} alt={"img"} className="w-full aspect-video object-cover border rounded-md"></img>
                        <section className="flex justify-between items-center">
                            <section className="flex justify-start items-center gap-1">
                                <Avatar>
                                    <AvatarImage 
                                        src={gig.seller.profilePicture}
                                        className="border border-black rounded-full"
                                    >
                                    </AvatarImage>
                                </Avatar>
                                <p className="">{gig.seller.name}</p>
                            </section>
                            <span>Level 2 **</span>
                        </section>
                        <Link
                            className="max-w-full h-[3em] overflow-hidden text-ellipsis whitespace-normal hover:text-blue-900 hover:underline hover:cursor-pointer break-words"
                            href={`/gig/${gig.id}`}
                        >
                            {gig.title}
                        </Link>
                        <span className="flex gap-0.5 items-center"><Star width={20}/> 5</span>
                        <span>From ${gig.pricing.length > 0 ? Math.min(...gig.pricing.map(p => p.price)) : "N/A"}</span>
                    </CardContent>
                </Card>
            ))}
        </div>
        </div>
    )
}

