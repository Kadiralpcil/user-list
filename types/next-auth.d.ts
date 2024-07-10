import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string | number | null;
      username?: string | null;
      email?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      gender?: string | null;
      image?: string | null;
      token?: string | null;
      refreshToken?: string | null;
    } & DefaultSession["user"];
  }
  interface User {
    id?: number | null;
    username?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    image?: string | null;
    token?: string | null;
    refreshToken?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends JWT {
    id?: string | number | null;
    username?: string | null;
    email?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    gender?: string | null;
    image?: string | null;
    token?: string | null;
    refreshToken?: string | null;
  }
}
