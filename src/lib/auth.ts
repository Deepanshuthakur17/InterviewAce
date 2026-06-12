import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import prisma from "@/lib/prisma"
import { hashPassword, verifyPassword } from "@/lib/hash"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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
        if (!credentials?.email || !credentials?.password) return null;

        try {
          // Connect to Neon Database
          let user = await prisma.user.findUnique({
            where: { email: credentials.email }
          });

          // Auto-register user if they don't exist
          if (!user) {
            const hashedPassword = hashPassword(credentials.password);
            user = await prisma.user.create({
              data: {
                email: credentials.email,
                password: hashedPassword,
                name: credentials.email.split('@')[0], // Dynamic name from email
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(credentials.email.split('@')[0])}&background=random&color=fff&size=150`,
                skills: [],
                resumeParsedSkills: [],
                accountType: "email"
              }
            });
          } else {
            // If user exists, verify password
            if (user.password) {
              const isValid = verifyPassword(credentials.password, user.password);
              if (!isValid) {
                throw new Error("Invalid email or password");
              }
            } else {
              // Legacy/Google user logging in with credentials for the first time
              // We set their password securely on first credential login
              const hashedPassword = hashPassword(credentials.password);
              user = await prisma.user.update({
                where: { id: user.id },
                data: { password: hashedPassword }
              });
            }
            
            // Ensure existing user gets accountType set to email if it isn't set yet
            if (!user.accountType) {
              user = await prisma.user.update({
                where: { id: user.id },
                data: { accountType: "email" }
              });
            }
          }

          return { id: user.id, name: user.name, email: user.email, image: user.avatar, accountType: user.accountType || "email" }
        } catch (error) {
          console.error("[NextAuth Authorize Error]:", error);
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as const,
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
  debug: true,
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
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
                resumeParsedSkills: [],
                accountType: "google"
              }
            });
          } else if (!dbUser.accountType) {
            // Backfill accountType for existing users signing in with Google
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: { accountType: "google" }
            });
          }
          
          // Sync database ID to NextAuth user object for the JWT token
          user.id = dbUser.id;
          (user as any).accountType = dbUser.accountType || "google";
        }
        return true;
      } catch (error) {
        console.error("[NextAuth SignIn Callback Error]:", error);
        return false;
      }
    },
    async jwt({ token, trigger, session, user }) {
      // Upon initial sign in, bind the DB user id to the token
      if (user) {
        token.sub = user.id;
        token.accountType = (user as any).accountType;
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
        session.user.accountType = token.accountType;
      }
      return session;
    }
  }
}
