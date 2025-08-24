import  { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
      image?: string | null;
    } & DefaultSession["user"];
    accessToken: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    image?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
    name?: string;
    email?: string;
    picture?: string;
  }
}
