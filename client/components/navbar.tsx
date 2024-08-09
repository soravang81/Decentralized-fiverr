import WalletConnect from "./walletConnect";
import { ProfileMenu } from "./profileMenu";
import { LoginButton, RoleToggleButton } from "./buttons";
import { getServerSession, Session } from "next-auth";
import { authConfig } from "@/lib/auth";
import Link from "next/link";
import { getLastRole } from "@/app/actions/buyer/role";
import { getSellerProfileImage } from "@/app/actions/seller/sellerProfile";

export default async function Navbar ({session}:{session:Session | null}) {
    // const session = await getServerSession(authConfig);
    const role = session && await getLastRole(session.user.id)

    return (
        <div className="w-screen border shadow-md text-3xl px-10 py-2 flex justify-between items-center">
            <Link href={"/"}><span className="font-bold">DFiverr</span></Link>
            <section className="flex justify-between items-center">
                {session && role && <>
                    <RoleToggleButton session={session}/>
                    <WalletConnect/>
                    {session && role && <ProfileMenu session={session}/>}
                </>}
                <LoginButton session={session}/>
            </section>  
        </div>
)
}