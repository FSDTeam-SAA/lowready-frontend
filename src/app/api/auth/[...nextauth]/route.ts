import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.success || !data.data?.accessToken) {
            throw new Error(data.message || "Invalid credentials");
          }

          // ✅ return user object
          return {
            id: data.data._id,
            name: data.data.name || data.data.email || "",
            email: data.data.email,
            role: data.data.role,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
            image: data.data.image || undefined,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          throw new Error("Login failed. Please check your credentials.");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as string;
      }
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string | undefined;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
