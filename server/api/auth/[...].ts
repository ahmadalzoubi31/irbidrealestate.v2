import CredentialsProvider from "next-auth/providers/credentials";
import { NuxtAuthHandler } from "#auth";
import prisma from "~/lib/prisma";
import type { User } from "@prisma/client";
import bycrpt from "bcrypt";

export default NuxtAuthHandler({
  // a) Never hardcode your secret in your code!! and b) use a secure secret, `test-123` is **not** secure!!
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },

  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: "Credentials",
      credentials: {},
      async authorize(credentials: { username: string; password: string }) {
        // TODO: Fetch user from database
        try {
          // if (credentials.username === 'appadmin') {
          //   return {
          //     username: 'appadmin',
          //     name: 'appadmin',
          //     email: 'appadmin@null.net',
          //   }
          // }
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username || "",
            },
          });

          if (!user) {
            throw createError({
              statusCode: 401,
              message: "Unauthorized",
            });
          }

          const isValid = await bycrpt.compare(credentials.password, user.password);
          if (!isValid) {
            throw createError({
              statusCode: 401,
              message: "Unauthorized",
            });
          }

          return {
            id: user.id,
            username: user.username,
            name: user.username,
            email: user.username + "@null.net",
          };
        } catch (error) {
          return error;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    // Seconds - How long until an idle session expires and is no longer valid.
    maxAge: Number(process.env.TokenExpired as string) || 1 * 24 * 60 * 60, // 1 days
  },

  callbacks: {
    /* on before signing */
    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user: user.name });
      if (user.name === "Error") {
        return false;
      } else {
        return true;
      }
    },
    /* on redirect to another url */
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    /* on JWT token creation or mutation */
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user,
        };
      }
      return token;
    },
    /* on session retrieval */
    async session({ session, token, user }) {
      // Add user information to the session object
      session.user = {
        ...token,
        ...session.user,
        ...user,
      };

      return session;
    },
  },
});
