import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star, Heart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { IGetGigs } from "@/lib/types"


export const BuyerGigs = ({ gigs }: { gigs: IGetGigs[] }) => {

  return (
    <div className="container py-10">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gigs.map((gig) => (
          <Card key={gig.id} className="overflow-hidden transition-all hover:shadow-lg hover:scale-105 duration-300">
            <Link href={`/gig/${gig.id}`} className="block">
              <div className="relative aspect-video">
                <Image
                  src={gig.picture || "/placeholder.svg"}
                  alt={gig.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform hover:scale-105"
                />
                <button className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-100">
                  <Heart className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </Link>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={gig.seller.profilePicture} alt={gig.seller.name} />
                    <AvatarFallback>{gig.seller.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">{gig.seller.name}</span>
                </div>
                <Badge variant="secondary">Level 2</Badge>
              </div>
              <Link href={`/gig/${gig.id}`} className="block">
                <h3 className="text-lg font-semibold leading-tight mb-2 hover:text-primary transition-colors line-clamp-2">
                  {gig.title}
                </h3>
              </Link>
              <div className="flex items-center space-x-1 text-sm text-yellow-500 mb-2">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-medium">{4.5.toFixed(1)}</span>
                <span className="text-gray-400">({3})</span>
              </div>
              <div className="flex items-end justify-between">
                <span className="text-xs text-gray-500 pb-1">Starting at</span>
                <span className="text-lg font-bold">
                  ${gig.pricing.length > 0 ? Math.min(...gig.pricing.map((p) => p.price)).toFixed(2) : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}