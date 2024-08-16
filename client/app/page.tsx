import { authConfig } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { getLastRole } from "./actions/buyer/role";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig)
  // console.log(session)
  
  const lastRole = session?.user.id ? await getLastRole(session?.user.id) : console.log("Role not found")
  
  if(lastRole === "SELLER"){
    redirect("/seller_dashboard")
  }

  return (
    <>
    </>  
  );
}
