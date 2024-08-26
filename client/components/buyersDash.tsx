import { Session } from "next-auth"
import Link from "next/link"
import { Container } from "./container"
import { BuyerGigs } from "./buyerGigs"
import { createGig, getGigs } from "@/app/actions/seller/gigs";
import { dummygig, dummypricing } from "@/lib/populate";

export const BuyersHomepage = async ({ session }: { session: Session | null }) => {
  const { user } = session || {};
  // if(!user) return
  const welcomeMessage = `Welcome back${user?.name ? `, ${user?.name}` : '' }`;
  const gigs = await getGigs()

  if(!gigs) return

  return (
    <>
      <Container className="bg-[url('/bg-home.jpg')] bg-auto h-48 bg-bottom bg-pink-700 bg-blend-multiply">
        <section className="flex justify-between">
          <h1 className="text-3xl text-white font-bold">{welcomeMessage}</h1> 
          <h1 className="text-xl  text-white font-bold">
            Made by{' '}
            <Link
              href="https://x.com/sourxv_me"
              target="_blank"
              className="hover:text-gray-400 hover:font-semibold underline"
            >
              @sourxv_me
            </Link>
          </h1>
        </section>
      </Container>
      <BuyerGigs gigs={gigs.gigs}/>
    </>
  );
};
