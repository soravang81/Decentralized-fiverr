import { getOrders, replyOrder } from "@/app/actions/buyer/orders"
import { OrderButtons } from "@/components/buttons"
import { CancelOrder } from "@/components/cancelOrder"
import { MarkComplete } from "@/components/markComplete"
import RaiseDispute from "@/components/raiseDispute"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTimeDifference } from "@/lib/utils"

export default async function SellerOrdersPage () {
   const orders = await getOrders({user : "SELLER"})

   const pendingOrders = orders.filter(order => ["PENDING", "ACCEPTED_BY_SELLER", "PAYMENT_PENDING"].includes(order.status))
   const activeOrders = orders.filter(order => ["PROCESSING" , "COMPLETED_BY_SELLER" , "COMPLETED_BY_BUYER"].includes(order.status))
   const cancelledOrders = orders.filter(order => ["CANCELLED_BY_BUYER", "CANCELLED_BY_SELLER"].includes(order.status))
   const deliveredOrders = orders.filter(order => order.status === "DELIVERED")

   return <div className="container py-6">
      <Tabs defaultValue="pending" className="w-full">
         <TabsList className="w-full">
            <TabsTrigger value="pending" className="w-full">Pending</TabsTrigger>
            <TabsTrigger value="active" className="w-full">Active</TabsTrigger>
            <TabsTrigger value="cancelled" className="w-full">Cancelled</TabsTrigger>
            <TabsTrigger value="delivered" className="w-full">Delivered</TabsTrigger>
         </TabsList>
         <TabsContent value="pending">
            <div className="flex flex-col gap-4">
               {pendingOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-lg border flex flex-col md:flex-row justify-between shadow-md">
                     <div className="flex flex-col">
                        <p className="font-semibold text-lg">{order.gig.title}</p>
                        <section className="flex flex-col gap-1 ml-4">
                           <p className="text-gray-500">By : {order.buyer.name}</p>
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
                            <p className="text-gray-500">{getTimeDifference(order.createdAt)}</p>
                        </section>
                     </div>
                     <div className="flex flex-col gap-2">
                        {/* TODO : send email to buyer if accepted or rejected */}
                        <span className="self-center text-lg font-semibold">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</span>
                        <section className="flex gap-2">
                           {order.status === "PENDING" && <OrderButtons orderId={order.id}/>}
                           {<span>Status : {order.status === "PAYMENT_PENDING" ?  "Payment pending by Buyer" : order.status}</span>}
                        </section>
                     </div>
                  </div>
               ))}
            </div>
         </TabsContent>
         <TabsContent value="active">
            <div className="flex flex-col gap-4">
               {activeOrders.map(order => (
                  <div key={order.id} className="px-8 p-4 rounded-lg flex flex-col md:flex-row justify-between border shadow-md">
                     <div className="flex flex-col">
                        <p className="text-lg font-semibold ">{order.gig.title}</p>
                        {/* TODO : Add go to profile (make a profile section first for both buyer and seller dash) */}
                        <section className="flex flex-col gap-1 ml-4">
                           <p className="text-gray-500">For : {order.seller.name}</p>
                           <p className="text-gray-500">{getTimeDifference(order.createdAt)}</p>
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
                           <p className="text-gray-500 text-wrap">Deadline : {order.deadline.toString()}</p>
                        </section>
                     </div>
                     <div className="flex flex-col gap-2">                              
                        <p className="text-gray-700 text-lg">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                        <section className="flex gap-2">
                           <CancelOrder order={order} seller/>
                           {order.status !=="COMPLETED_BY_SELLER" && <MarkComplete order={order} freelancer/>}
                           <RaiseDispute orderId={order.id}/>
                        </section>
                        <p className="text-gray-700">Status : {order.status}</p>
                     </div>
                  </div>
               ))}
            </div>
         </TabsContent>
         <TabsContent value="cancelled">
            <div className="flex flex-col gap-4">
               {cancelledOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-lg border flex flex-col md:flex-row justify-between shadow-md">
                     <section className="flex flex-col">
                        <p className="font-semibold text-lg">{order.gig.title}</p> 
                        <p className="text-gray-500 ml-2">For : {order.seller.name}</p>
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
                        <p className="text-gray-500">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                     </section>
                  </div>
               ))}
            </div>
         </TabsContent>
         <TabsContent value="delivered">
            <div className="flex flex-col gap-4">
               {deliveredOrders.map(order => (
                  <div key={order.id} className="p-4 rounded-lg border flex flex-col md:flex-row justify-between shadow-md">
                     <section className="flex flex-col">
                        <p className="font-semibold text-lg">{order.gig.title}</p> 
                        <p className="text-gray-500 ml-2">For : {order.seller.name}</p>
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
                     </section>
                     <section>
                        <p className="text-gray-500">${order.amount} x {order.quantity} = ${order.amount * order.quantity}</p>
                     </section>
                  </div>
               ))}
            </div>
         </TabsContent>
      </Tabs>
   </div>

}