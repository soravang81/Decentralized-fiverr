import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import db from "@/db/db"
import { NextAuthOptions, Session } from 'next-auth';
import { UserRole } from "@prisma/client";

enum Provider {
  Google = "Google",
  Github = "Github"
}

export const authConfig: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      try {
        if (account?.providerAccountId) {
          const user = await db.user.findFirst({
            where: { sub: account.providerAccountId }
          });
          if (user) {
            token.id = user.id;
            token.role = user.role;
          }
        }
      } catch (error) {
        console.error("Error in JWT callback:", error);
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },

    async signIn({ user, account, profile }) {
        try {
          if (!account?.provider) {
            console.error("No provider in account object");
            return '/auth/error?error=NoProvider';
          }
      
          if (!user.email) {
            console.error("No email provided by OAuth provider");
            return '/auth/error?error=NoEmail';
          }
      
          // Check if user exists in your database
          const userDb = await db.user.findFirst({
            where: { username: user.email }
          });
      
          if (userDb) {
            console.log("Existing user found, allowing sign in");
            return true;
          }
      
          console.log("Creating new user");
          await db.user.create({
            data: {
              username: user.email,
              name: profile?.name ?? user.name,
              profilePicture: profile?.image ?? user.image,
              provider: account.provider === "google" ? "Google" : "Github",
              sub: account.providerAccountId
            }
          });
      
          console.log("New user created successfully");
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return `/auth/error?error=${error}`;
        }
      }
  }
};