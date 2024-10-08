import { Card, CardContent } from "@/components/ui/card";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getSellerProfile } from "../actions/seller/sellerProfile";
import { Container } from "@/components/container";
import { Orders } from "@/components/sellerOrders";
import Link from "next/link";
import { StarIcon, TrendingUpIcon, DollarSignIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SellerDashboard() {
  const session = await getServerSession(authConfig);
  
  if (!session) {
    console.log("Unauthorised")
    redirect("/")
  }
  
  const sellerProfileData = await getSellerProfile(session?.user.id)
  
  if (!sellerProfileData) {
    return (
      <Container className="py-8">
        <div className="bg-foreground p-8 rounded-lg shadow-xl max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">No Seller Profile Found</h1>
          <p className="text-center text-gray-600 mb-8">Create a seller profile to access your dashboard and start freelancing.</p>
          <div className="flex justify-center">
            <Link href="/create-seller-profile"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg"
            >
              Create Seller Profile
            </Link>
          </div>
        </div>
      </Container>
    );
  }
  
  const totalEarnings = sellerProfileData.orders
    .filter(order => order.status === "DELIVERED")
    .reduce((acc, order) => acc + order.amount * order.quantity, 0);

  return (
    <Container className="py-8">
      <h1 className="font-bold text-3xl text-gray-100 mb-8">Welcome, {sellerProfileData.name}</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card className="mb-8 overflow-hidden bg-foreground/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <img src={sellerProfileData.profilePicture} alt={sellerProfileData.name} className="w-20 h-20 rounded-full border-4 border-blue-500 object-cover"/>
                <div>
                  <h2 className="text-xl font-semibold text-gray-100">{sellerProfileData.name}</h2>
                  <p className="text-gray-300">Freelance Professional</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300 flex items-center"><TrendingUpIcon className="w-5 h-5 mr-2 text-blue-400" /> My Level</span>
                  <span className="font-semibold text-blue-400">New</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-600">
                  <span className="text-gray-300 flex items-center"><StarIcon className="w-5 h-5 mr-2 text-yellow-400" /> Rating</span>
                  <span className="font-semibold text-yellow-400">Not Rated</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-300 flex items-center"><DollarSignIcon className="w-5 h-5 mr-2 text-green-400" /> Total Earnings</span>
                  <span className="font-semibold text-green-400">${totalEarnings.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-foreground/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-lg text-gray-100 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/seller_dashboard/gigs/create-gig" className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out">
                  Create New Gig
                </Link>
                <Link href="/seller_dashboard/messages" className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded transition duration-300 ease-in-out">
                  Check Messages
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="md:col-span-2">
          <Card className="bg-foreground/5">
            <CardContent className="p-6">
              <h3 className="font-semibold text-xl text-gray-100 mb-6">Recent Orders</h3>
              <Orders orders={sellerProfileData.orders} />
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}