"use client"
import { replyOrder } from "@/app/actions/buyer/orders"
import { getTimeDifference } from "@/lib/utils"
import { CancelOrder } from "./cancelOrder"
import { useEffect, useState } from "react"
import { useRecoilState } from "recoil"
import { Orders } from "@/lib/recoil/atoms"
import { IGetOrders } from "@/lib/types"
import { MarkComplete } from "./markComplete"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import InitializeEscrow from "./escrow"
import RaiseDispute from "./raiseDispute"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { toast } from "sonner"

export const MyOrders = ({orders}:{orders : IGetOrders[]}) => {
    const [orderz,setOrders] = useRecoilState(Orders)
    useEffect(()=>{
        console.log(orders)
        setOrders(orders)
    },[])

    const pendingOrders = orders.filter(order => ["PENDING", "ACCEPTED_BY_SELLER", "PAYMENT_PENDING"].includes(order.status))
    const activeOrders = orders.filter(order => ["PROCESSING" , "COMPLETED_BY_SELLER" , "COMPLETED_BY_BUYER"].includes(order.status))
    const cancelledOrders = orders.filter(order => ["CANCELLED_BY_BUYER", "CANCELLED_BY_SELLER"].includes(order.status))
    const deliveredOrders = orders.filter(order => ["DELIVERED"].includes(order.status) )

    return <Tabs defaultValue="pending" className="w-full">
        <TabsList className="w-full bg-gray-200">
            <TabsTrigger value="pending" className="w-full">Pending</TabsTrigger>
            <TabsTrigger value="active" className="w-full">Active</TabsTrigger>
            <TabsTrigger value="cancelled" className="w-full">Cancelled</TabsTrigger>
            <TabsTrigger value="completed" className="w-full">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending">
            <div className="flex flex-col gap-4">
                {pendingOrders.map((order:IGetOrders, index:number) => {
                    if(!order.seller.wallet) return
                    return <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-gray-700">{order.gig.description}</p>
                            <p className="text-gray-700">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex min-w-fit">
                            <section className="flex flex-col">
                                <p className="text-gray-800 text-2xl mb-1">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                                <p className="text-gray-700">{getTimeDifference(order.createdAt)}</p>
                                <p className="text-gray-700">Status : {order.status}</p>
                            </section>
                            <section className="ml-4 flex flex-col gap-2">
                                {order.status === "PROCESSING" || order.status === "PENDING" && <> 
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant={"destructive"}>Cancel</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogTitle>
                                            Cancel Order
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to cancel this order?
                                        </AlertDialogDescription>
                                        <AlertDialogCancel>
                                            <Button variant ="outline" className="w-full" >Cancel</Button>
                                        </AlertDialogCancel>
                                        <AlertDialogAction>
                                            <Button variant="default" className="w-full" onClick={async () => {
                                                await replyOrder({orderId : order.id , reply : "REJECT_BY_BUYER"})
                                                toast.success("Order Cancelled Successfully");
                                                setOrders(orders.filter(o => {
                                                    if(o.id === order.id) return {...o,status : "CANCELLED_BY_BUYER"}
                                                }))
                                            }} >Confirm</Button>
                                        </AlertDialogAction>
                                    </AlertDialogContent>    
                                </AlertDialog>
                                 </> 
                                } 
                                {order.status === "PAYMENT_PENDING" && <InitializeEscrow order={order}/>}
                            </section>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
        <TabsContent value="active">
            <div className="flex flex-col gap-4">
                {activeOrders.map((order:IGetOrders, index:number) => {
                    return <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-gray-700">{order.gig.description}</p>
                            <p className="text-gray-700">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col gap-2 justify-end min-w-fit">
                            <div className="flex gap-2 items-center">
                                <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                                <RaiseDispute orderId={order.id}/>
                            
                            </div>
                            <CancelOrder order={order} buyer />
                            {order.status !== "COMPLETED_BY_BUYER" && <><MarkComplete order={order} client /></>}
                            <p className="text-gray-700">{getTimeDifference(order.createdAt)}</p>
                            <p className="text-gray-700">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
        <TabsContent value="cancelled">
            <div className="flex flex-col gap-4">
                {cancelledOrders.map((order:IGetOrders, index:number) => {
                    return <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-gray-700">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col min-w-fit">
                            <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                            <p className="text-gray-700">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
        <TabsContent value="completed">
            <div className="flex flex-col gap-4">
                {deliveredOrders.map((order:IGetOrders, index:number) => {
                    return <div key={index} className="bg-gray-100 p-4 rounded-lg flex justify-between">
                        <div className="">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-gray-700">{order.gig.description}</p>
                            <p className="text-gray-700">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col min-w-fit">
                            <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                            <p className="text-gray-700">{getTimeDifference(order.createdAt)}</p>
                            <p className="text-gray-700">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
    </Tabs>
}
