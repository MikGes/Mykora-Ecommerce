import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { authService } from "@/services/auth.service";
import type { UserProfile } from "@/types";

declare module "next-auth" {
  interface Session {
    user: UserProfile & { emailVerified?: boolean };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await authService.verifyPassword(
            credentials.email as string,
            credentials.password as string
          );
          return user;
        } catch {
          return null;
        }
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "placeholder",
    }),
  ],
  pages: {
    signIn: "/login",
    newUser: "/signup",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const u = user as UserProfile;
        token.id = u.id;
        token.role = u.role;
        token.loyaltyTier = u.loyaltyTier;
        token.loyaltyPoints = u.loyaltyPoints;
        token.emailVerified = u.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
        session.user.loyaltyTier =
          (token.loyaltyTier as UserProfile["loyaltyTier"]) ?? "SILVER";
        session.user.loyaltyPoints = (token.loyaltyPoints as number) ?? 0;
        (session.user as UserProfile).emailVerified =
          (token.emailVerified as boolean) ?? false;
      }
      return session;
    },
  },
  trustHost: true,
});
