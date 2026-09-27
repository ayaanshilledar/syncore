import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CILENT || process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SCERET || process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser({ user }) {
      if (user?.email) {
        try {
          await sendWelcomeEmail({ email: user.email, name: user.name });
          if (user.id) {
            await prisma.user.update({
              where: { id: user.id },
              data: { welcomeEmailSent: true },
            });
          }
        } catch (err) {
          console.error("[Auth Event] Error in createUser welcome email:", err);
        }
      }
    },
    async signIn({ user }) {
      if (user?.email && user?.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { welcomeEmailSent: true },
          });
          if (dbUser && !dbUser.welcomeEmailSent) {
            await sendWelcomeEmail({ email: user.email, name: user.name });
            await prisma.user.update({
              where: { id: user.id },
              data: { welcomeEmailSent: true },
            });
          }
        } catch (err) {
          console.error("[Auth Event] Error in signIn welcome email check:", err);
        }
      }
    },
  },
});
