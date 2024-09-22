import { MyOrders } from "@/components/myOrders";
import { getOrders } from "../actions/buyer/orders";

export default async function BuyerOrders () {
    const orders = await getOrders({user : "BUYER"})
    return <div className="container py-6">
        <div>
            <h1 className="text-3xl font-bold mb-4 pt-20">My Orders</h1>
            <MyOrders orders={orders}/>
        </div>
    </div>
}