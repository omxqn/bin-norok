import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, request) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = String(credentials.email).trim().toLowerCase().slice(0, 254);

        // Brute-force protection: 5 attempts per 5 minutes per IP+email
        const ip =
          request?.headers?.get?.("x-forwarded-for")?.split(",")[0]?.trim() ||
          "unknown";
        const rate = checkRateLimit(`${ip}:${email}`, "login");
        if (!rate.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email }
        });

        if (!user) {
          // Constant-time-ish: hash a dummy password so "user not found"
          // takes as long as a wrong password (prevents user enumeration)
          await bcrypt.compare(String(credentials.password), "$2a$12$invalidsaltinvalidsaltinvalidsaltinvalid12");
          return null;
        }

        const isValidPassword = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/ar/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8-hour sessions
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
