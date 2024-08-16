import { Card, CardContent } from "@/components/ui/card";
import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getSellerProfile } from "../actions/seller/sellerProfile";
import { Container } from "@/components/container";
import { Orders } from "@/components/orders";


export default async function SellerDashboard () {
    const session = await getServerSession(authConfig);
    console.log(session)
    if(!session) {
        return
    }
    //   createGig(dummygig)
    // createOrder(dummyorder)
    // createPricingPackage(dummypricing)

    const sellerProfileData = await getSellerProfile(session?.user.id)
    // console.log(sellerProfileData)
    

    if (sellerProfileData)
        return <div className="bg-gray-100 ">
        <Container className="flex gap-10">
            <div className="flex flex-col gap-4">
                <Card className="min-w-80 max-w-96 p-2">
                    <CardContent className="flex flex-col gap-4 p-4 pb-2">
                        <div className="flex items-center gap-2">   
                            <img src={sellerProfileData.profilePicture} className="size-16 border rounded-full"/>
                            <span>{sellerProfileData.name}</span>
                        </div>
                        <section className="flex justify-between border-b pb-2">
                            <span>My level</span>
                            <span>new</span>
                        </section>
                        <section className="flex justify-between">
                            <span>Rating</span>
                            <span>*</span>
                        </section>
                    </CardContent>
                </Card>{/*/ TODO add rating , level and earning in object by months*/}
                <Card className="min-w-60 max-w-96 p-1">
                    <CardContent className="flex flex-col gap-4 p-4">
                        <section className="flex justify-between">
                            <span>Earnings</span>
                            <span>$0</span>
                        </section>
                    </CardContent>
                </Card>
            </div>
            <div>
                <h1 className="font-bold text-xl">Welcome, {sellerProfileData.name}</h1>
                <div className="">
                    <Orders orders={sellerProfileData.orders}/>
                </div>
            </div>
        </Container>
        </div>
}