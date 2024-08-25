"use client"
import { PricingPackage } from "@prisma/client"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet"
import { useEffect, useState } from "react"
import { Card , CardContent , CardFooter , CardHeader , CardTitle} from "./ui/card"
import { ArrowLeft } from "lucide-react"
import InitializeEscrow from "./escrow"
import { PublicKey } from "@solana/web3.js"
import { createOrder, replyOrder } from "@/app/actions/buyer/orders"
import { toast } from "sonner"

export const BuyOrders = ({pkg , walletAddress , sellerId }:{pkg : PricingPackage , sellerId : string,walletAddress : string}) => {
    const { gigId, name, description, price, deliveryTime } = pkg
    const [quantity, setQuantity] = useState(1)
    const [total, setTotal] = useState(price)

    // console.log(sellerId)
    const increaseQty = () => {
        setQuantity(quantity + 1)
        setTotal(total + price)
    }

    const decreaseQty = () => {
        if(quantity > 1) {
            setQuantity(quantity - 1)
            setTotal(total - price)
        }
    }
    const handleSubmit = async () => {
        const res = await createOrder({
            order: {
              packageId: pkg.id,
              gigId: pkg.gigId,
              sellerId: sellerId,
              quantity: quantity,
              amount: pkg.price,
              deadline: new Date(Date.now() + pkg.deliveryTime * 24 * 60 * 60 * 1000),
            }
        })
        if(res){
            toast.success("Order created successfully. !")
        } else {
            toast.error("Order creation failed. !"+res)
        }
    }

    return <Sheet>
        <SheetTrigger asChild>
            <Button variant={"default"} >Continue</Button>
        </SheetTrigger>
        <SheetContent>
            {<Card className="bg-base-100 shadow-sm  mt-4 p-6 pb-2">
                <div className="flex flex-col items-center justify-between">
                    <div className="flex w-full items-center py-2 justify-between ">
                        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
                        <p className="text-sm text-muted-foreground">x {quantity}</p>
                    </div>
                    <p className="text-base self-start">{description}</p>
                </div>
                <CardContent className="flex items-center justify-between">
                    <div className="flex items-center justify-between w-full py-2">
                        <p>Gig Quantity</p>
                        <div>
                            <Button variant="outline" className="mr-2" onClick={decreaseQty}>-</Button>
                            <Button variant="outline" onClick={increaseQty}>+</Button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-2 flex items-center justify-between">
                    <p className="text-lg font-semibold">Total: ${total}</p>
                    <p className="text-sm text-muted-foreground">Est. delivery: {deliveryTime} days</p>
                </CardFooter>
                <Button onClick={handleSubmit} className="mt-4">Send Order Approval</Button>
            </Card>}
        </SheetContent>
    </Sheet>
}