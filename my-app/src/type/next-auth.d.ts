import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user:User
    userid:string
  }

  interface User {
    id: string;
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string
    googleid?: string
  }
}