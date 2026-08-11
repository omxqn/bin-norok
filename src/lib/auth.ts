import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { checkRateLimit } from "@/lib/rate-limit";

// Work factor for every password hash in the app. Keep in sync with
// src/actions/users.ts and prisma/seed.ts.
export const HASH_ROUNDS = 12;

// A real hash of the same cost, compared against when the email is unknown so
// that "no such user" takes the same time as "wrong password". A malformed
// string would be rejected by bcrypt without doing any key-schedule work,
// which would *create* the enumeration oracle instead of closing it.
const DUMMY_HASH = bcrypt.hashSync("dummy-password-for-timing", HASH_ROUNDS);

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
          // Burn the same time a real comparison costs, so response latency
          // does not reveal whether the email exists.
          await bcrypt.compare(String(credentials.password), DUMMY_HASH);
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
      // Role is carried in the JWT and read from there on every request — no
      // database round-trip per request. Tradeoff: a demoted or deleted
      // account keeps its old role until the token expires, so maxAge below
      // is kept short to bound that window.
      if (user) {
        token.role = user.role;
        token.id = user.id ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      // Session.user is augmented with id/role in src/types/next-auth.d.ts,
      // so these assign directly — no `any` cast needed.
      if (session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    }
  },
  pages: {
    signIn: "/ar/admin/login",
  },
  session: {
    strategy: "jwt",
    // Role lives in the token, so this doubles as the revocation window:
    // a demoted admin keeps their old role until the token expires.
    maxAge: 2 * 60 * 60, // 2-hour sessions
    updateAge: 30 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET,
});
