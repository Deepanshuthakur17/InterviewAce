import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email) return null;

        // Connect to Neon Database
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        // Auto-register user if they don't exist
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split('@')[0], // Dynamic name from email
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email.split('@')[0])}&background=random&color=fff&size=150`,
              skills: [],
              resumeParsedSkills: []
            }
          });
        }

        return { id: user.id, name: user.name, email: user.email, image: user.avatar }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        // Check if user exists in our database
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email }
        });
        
        // Auto-register Google users if they don't exist yet
        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || user.email.split('@')[0],
              avatar: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.email.split('@')[0])}&background=random&color=fff&size=150`,
              skills: [],
              resumeParsedSkills: []
            }
          });
        }
        
        // Sync database ID to NextAuth user object for the JWT token
        user.id = dbUser.id;
      }
      return true;
    },
    async jwt({ token, trigger, session, user }) {
      // Upon initial sign in, bind the DB user id to the token
      if (user) {
        token.sub = user.id;
      }
      
      if (trigger === "update" && session) {
        token.name = session.name;
        token.email = session.email;
        token.picture = session.image;
      }
      return token;
    },
    async session({ session, token }: { session: any, token: any }) {
      if (session.user) {
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    }
  }
}
