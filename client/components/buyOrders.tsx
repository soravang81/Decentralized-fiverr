"use client"
import { PricingPackage, SellerProfile, User } from "@prisma/client"
import { Button } from "./ui/button"
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "./ui/sheet"
import { useEffect, useState } from "react"
import { Card , CardContent , CardFooter , CardHeader , CardTitle} from "./ui/card"
import { createOrder, replyOrder } from "@/app/actions/buyer/orders"
import { toast } from "sonner"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogOverlay, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import useSendEmail from "@/lib/hooks"
import { IGigExtended } from "@/app/gig/[id]/page"

export const BuyOrders = ({pkg , seller , sellerId }:{pkg : PricingPackage , sellerId : string,seller : IGigExtended["seller"]}) => {
    const { gigId, name, description, price, deliveryTime } = pkg
    const [quantity, setQuantity] = useState(1)
    const [total, setTotal] = useState(price)
    const {sendEmail , loading , error} = useSendEmail()

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
            await sendEmail({
                to : seller.user.username,
                subject : "New Order approval request",
                text : `Hello ${seller.user.name} ! \n\nYou have a new order request waiting to get your approval.\n\nRegards DFiverr.\n\nYou can check your orders from here https://dfiverr.skillcode.website/orders`
            })
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
                <AlertDialog>
                    <AlertDialogTrigger asChild className="mt-2">
                        <Button variant="default" className="w-full" >Book Order</Button>
                    </AlertDialogTrigger>
                    <AlertDialogOverlay />
                    <AlertDialogContent>
                        <AlertDialogTitle>Confirm Order</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to proceed with this order?
                        </AlertDialogDescription>
                        <div className="grid grid-cols-2 gap-2">
                            <AlertDialogCancel asChild>
                                <Button variant="outline" className="w-full" >Cancel</Button>
                            </AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button variant="default" className="w-full" onClick={handleSubmit}>Confirm</Button>
                            </AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </Card>}
        </SheetContent>
    </Sheet>
}