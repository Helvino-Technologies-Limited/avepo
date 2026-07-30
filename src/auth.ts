import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

const LOCKOUT_WINDOW_MS = 15 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;

async function recentFailedAttempts(email: string): Promise<number> {
  return prisma.activityLog.count({
    where: {
      action: "LOGIN_FAILED",
      entityType: "User",
      metadata: { equals: { email } },
      createdAt: { gte: new Date(Date.now() - LOCKOUT_WINDOW_MS) },
    },
  });
}

async function logLoginAttempt(action: "LOGIN_FAILED" | "LOGIN_SUCCESS", email: string, userId?: string) {
  await prisma.activityLog.create({
    data: { action, entityType: "User", entityId: userId, metadata: { email } },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  // Derive the redirect URL from the incoming request instead of a fixed
  // NEXTAUTH_URL — this app is reachable at multiple hosts (Vercel preview
  // URLs, avepo.vercel.app, and eventually avepo.co.ke), and a stale/local
  // NEXTAUTH_URL would otherwise send every login redirect to the wrong host.
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        // Brute-force protection: lock out further attempts for this email
        // for a window once too many failures land, regardless of whether
        // the account actually exists (avoids confirming/denying existence).
        const failedAttempts = await recentFailedAttempts(email);
        if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
          return null;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.isActive) {
          await logLoginAttempt("LOGIN_FAILED", email);
          return null;
        }

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) {
          await logLoginAttempt("LOGIN_FAILED", email, user.id);
          return null;
        }

        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await logLoginAttempt("LOGIN_SUCCESS", email, user.id);

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
});
