import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
export async function authenticateUser(email: any, password: any) {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) {
      return null;
    }
    if (user.password === password) {
      return {
        id: user.userid,
        email: user.email,
        name: user.name,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "user@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials) {
          return null;
        }

        const user = await authenticateUser(
          credentials.email,
          credentials.password,
        );

        if (user) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          };
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }: any) {
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email; // Add email to session
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email; // Add email to token
      }
      return token;
    },
  },
  pages: {
    signIn: "/login", // Optional: Specify custom login page if needed
  },
  session: {
    strategy: "jwt" as const, // Use JWT-based session management (stateless)
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
