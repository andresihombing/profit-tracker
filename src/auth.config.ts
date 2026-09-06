import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
        token.sub = user.id;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        const userId = typeof token.id === "string" ? token.id : token.sub;
        session.user.id = typeof userId === "string" ? userId : "";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
