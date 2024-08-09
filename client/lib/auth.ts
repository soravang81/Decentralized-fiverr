import GoogleProvider from "next-auth/providers/google";
import db from "@/app/db/db";
import { NextAuthOptions, Session } from 'next-auth';

export const authConfig:NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET || "",
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? ""
        })
    ],
    callbacks: {
        async jwt({ token, account, profile }: any) {
            const user = await db.user.findFirst({
                where: {
                    sub: account?.providerAccountId
                }
            })
            // console.log("userrr : ",user)
            if (user) {
              token.id = user.id
              token.role = user.role
            }
            return token
        },

        async session ({ session, token }: any)  {
            // const newSession = session;
            if (session.user) {
              session.user.id = token.id
              session.user.role = token.role
            }
            // console.log(session)
            return session as Session
        },
        async signIn({ user, account, profile}: any) {
            if (account?.provider === "google") {
                const email = user.email;
                if (!email) {
                    return false
                }
                const userDb = await db.user.findFirst({
                    where: {
                        username: email
                    }
                })
                if (userDb) {
                    return true;
                }
                await db.user.create({
                    data: {
                        username: email,
                        name: profile?.name,
                        profilePicture: profile?.picture,
                        provider: "Google",
                        sub: account.providerAccountId
                    }
                })
                return true;
            }
            return false
        },
    }
}