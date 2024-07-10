import { Login } from "@/app/Services/auth";
import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const authOptions: AuthOptions = {
  session: { strategy: "jwt", maxAge: 1800000 },
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await Login(credentials?.username, credentials?.password);
          return { ...res };
          throw new Error("Giriş başarılı.");
        } catch (error) {
          throw new Error(String(error));
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt({ user, token }) {
      if (user) {
        token = {
          ...token,
          id: user.id,
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          gender: user.gender,
          token: user.token,
          refreshToken: user.refreshToken,
        };
      }

      return token;
    },
    session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id,
          username: token.username,
          firstName: token.firstName,
          lastName: token.lastName,
          gender: token.gender,
          token: token.token,
          refreshToken: token.refreshToken,
        };
      }

      return session;
    },
    signIn({}) {
      return true;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
