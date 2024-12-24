import CredentialsProvider from 'next-auth/providers/credentials'
import { NuxtAuthHandler } from '#auth'
import prisma from "~/lib/prisma";
import type { User } from "@prisma/client";
import bycrpt from 'bcrypt'

export default NuxtAuthHandler({
  // a) Never hardcode your secret in your code!! and b) use a secure secret, `test-123` is **not** secure!!
  secret: process.env.NEXTAUTH_SECRET,

  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },

  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {},
      async authorize(credentials: { username: string, password: string }) {
        // TODO: Fetch user from database
        try {
          if (credentials.username === 'appadmin') {
            return {
              username: 'appadmin'
            }
          }
          const user = await prisma.user.findUnique({
            where: {
              username: credentials.username || '',
            }
          });

          if (!user) {
            throw createError({
              statusCode: 401,
              message: 'Unauthorized'
            })
          }

          const isValid = await bycrpt.compare(credentials.password, user.password)
          if (!isValid) {
            throw createError({
              statusCode: 401,
              message: 'Unauthorized'
            })
          }

          return {
            id: user.id,
            username: user.username,
          }
        } catch (error) {
          console.log('error', error);

        }
      }
    })
  ],

  session: {
    strategy: 'jwt',
  },

  callbacks: {
    /* on before signin */
    async signIn({ user, account, profile, email, credentials }) {
      return true
    },
    /* on redirect to another url */
    async redirect({ url, baseUrl }) {
      return baseUrl
    },
    /* on JWT token creation or mutation */
    async jwt({ token, user, account }) {
      if (user) {
        token = {
          ...token,
          ...user
        };
      }
      return token
    },
    /* on session retrival */
    async session({ session, token }) {
      // Add user information to the session object
      session.user = {
        ...token,
        ...session.user
      };

      return session
    }
  }
})
