import NextAuth, { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  debug: false,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // console.log("🔍 JWT callback", { tokenSub: token.sub, userId: user?.id });
      
      if (user) {
        // Ensure user exists in DB with proper role
        let dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });

        if (!dbUser) {
          console.log("Creating new user in DB");
          await prisma.user.create({
            data: {
              id: user.id,
              email: user.email || "",
              name: user.name,
              role: null, // No default role - user must choose
            },
          });
          token.role = null;
        } else {
          token.role = dbUser.role;
        }
      }
      
      // console.log("🔍 JWT token final:", { sub: token.sub, role: token.role });
      return token;
    },
    async session({ session, token }) {
      // console.log("🔍 Session callback", { tokenSub: token.sub, tokenRole: token.role });
      
      if (token && session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
      }
      
      // console.log("🔍 Session final:", { userId: session.user?.id, role: (session.user as any)?.role });
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  debug: process.env.NODE_ENV === "production",
};

export default NextAuth(authOptions);

