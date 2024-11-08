"use client"
import { replyOrder } from "@/app/actions/buyer/orders"
import { getTimeDifference } from "@/lib/utils"
import { CancelOrder } from "./cancelOrder"
import { IGetOrders } from "@/lib/types"
import { MarkComplete } from "./markComplete"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Button } from "./ui/button"
import InitializeEscrow from "./escrow"
import RaiseDispute from "./raiseDispute"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { toast } from "sonner"

export const MyOrders = ({orders}:{orders : IGetOrders[]}) => {
    // const [orderz,setOrders] = useRecoilState(Orders)
    // useEffect(()=>{
    //     console.log(orders)
    //     setOrders(orders)
    // },[])

    const pendingOrders = orders.filter(order => ["PENDING", "ACCEPTED_BY_SELLER", "PAYMENT_PENDING"].includes(order.status))
    const activeOrders = orders.filter(order => ["PROCESSING" , "COMPLETED_BY_SELLER" , "COMPLETED_BY_BUYER"].includes(order.status))
    const cancelledOrders = orders.filter(order => ["CANCELLED_BY_BUYER", "CANCELLED_BY_SELLER"].includes(order.status))
    const deliveredOrders = orders.filter(order => ["DELIVERED"].includes(order.status) )

    return <Tabs defaultValue="pending" className="w-full pt-2">
        <TabsList className="w-full">
            <TabsTrigger value="pending" className="w-full">Pending</TabsTrigger>
            <TabsTrigger value="active" className="w-full">Active</TabsTrigger>
            <TabsTrigger value="cancelled" className="w-full">Cancelled</TabsTrigger>
            <TabsTrigger value="completed" className="w-full">Completed</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="pt-2">
            <div className="flex flex-col gap-4">
                {pendingOrders.map((order:IGetOrders, index:number) => {
                    if(!order.seller.wallet) return
                    return <div key={index} className="p-4 rounded-lg flex flex-col md:flex-row bg-foreground/5 justify-between border">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-foreground">Description : {order.gig.description.substring(0,100)}...</p>
                            {order.escrow?.address && <p className="text-foreground">
                                Escrow Address:{" "}
                                <a 
                                    href={`https://explorer.solana.com/address/${order.escrow?.address}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="cursor-pointer hover:underline"
                                >
                                    {order.escrow?.address.slice(0, 6)}...{order.escrow?.address.slice(-4)}
                                </a>
                            </p>}
                            <p className="text-foreground">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col md:flex-row min-w-fit">
                            <section className="flex flex-col mb-4 md:mb-0 md:mr-4">
                                <p className="text-foreground text-2xl mb-1">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                                <p className="text-foreground">{getTimeDifference(order.createdAt)}</p>
                                <p className="text-foreground">Status : {order.status}</p>
                            </section>
                            <section className="flex flex-col gap-2">
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
                                                // setOrders(orders.filter(o => {
                                                //     if(o.id === order.id) return {...o,status : "CANCELLED_BY_BUYER"}
                                                // }))
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
                    return <div key={index} className="p-4 rounded-lg flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-foreground">{order.gig.description}</p>
                            <p className="text-foreground">
                                Escrow Address:{" "}
                                <a 
                                    href={`https://explorer.solana.com/address/${order.escrow?.address}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="cursor-pointer hover:underline"
                                >
                                    {order.escrow?.address.slice(0, 6)}...{order.escrow?.address.slice(-4)}
                                </a>
                            </p>
                            <p className="text-foreground">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col gap-2 justify-end min-w-fit">
                            <div className="flex gap-2 items-center">
                                <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                                <RaiseDispute orderId={order.id}/>
                            
                            </div>
                            <CancelOrder order={order} buyer />
                            {order.status !== "COMPLETED_BY_BUYER" && order.status === "COMPLETED_BY_SELLER" && <><MarkComplete order={order} client /></>}
                            <p className="text-foreground">{getTimeDifference(order.createdAt)}</p>
                            <p className="text-foreground">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
        <TabsContent value="cancelled">
            <div className="flex flex-col gap-4">
                {cancelledOrders.map((order:IGetOrders, index:number) => {
                    return <div key={index} className="p-4 rounded-lg flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-foreground">
                                Escrow Address:{" "}
                                <a 
                                    href={`https://explorer.solana.com/address/${order.escrow?.address}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="cursor-pointer hover:underline"
                                >
                                    {order.escrow?.address.slice(0, 6)}...{order.escrow?.address.slice(-4)}
                                </a>
                            </p>
                            <p className="text-foreground">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col min-w-fit">
                            <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                            <p className="text-foreground">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
        <TabsContent value="completed">
            <div className="flex flex-col gap-4">
                {deliveredOrders.map((order:IGetOrders, index:number) => {
                    return <div key={index} className="p-4 rounded-lg flex flex-col md:flex-row justify-between">
                        <div className="mb-4 md:mb-0">
                            <h2 className="text-xl font-semibold mb-2">{order.gig.title}</h2>
                            <p className="text-foreground">{order.gig.description}</p>
                            <p className="text-foreground">
                                Escrow Address:{" "}
                                <a 
                                    href={`https://explorer.solana.com/address/${order.escrow?.address}?cluster=devnet`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="cursor-pointer hover:underline"
                                >
                                    {order.escrow?.address.slice(0, 6)}...{order.escrow?.address.slice(-4)}
                                </a>
                            </p>
                            <p className="text-foreground">Quantity : {order.quantity}</p>
                        </div>
                        <div className="flex flex-col min-w-fit">
                            <p className="text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                            <p className="text-foreground">{getTimeDifference(order.createdAt)}</p>
                            <p className="text-foreground">Status : {order.status}</p>
                        </div>
                    </div>
                })}
            </div>
        </TabsContent>
    </Tabs>
}
