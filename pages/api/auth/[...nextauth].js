import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Client Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Temporary hardcoded users (Replace with DB lookup)
        const users = [
          { id: "1", username: "rayloser2025", password: "rayloser2025" },
          { id: "2", username: "themazzeoshow2025", password: "themazzeoshow2025" },
        ];

        const user = users.find(
            (u) => u.username === credentials.username && u.password === credentials.password
          );
  
          if (user) {
            return user; // ✅ Returns user object on successful login
          } else {
            throw new Error("Invalid username or password");
          }
        },
      }),
    ],
    pages: {
      signIn: "/login", // ✅ Custom login page
    },
    session: {
      strategy: "jwt",
      maxAge: 30 * 60, // ✅ Session expires after 30 minutes
    },
    callbacks: {
      async session({ session, token }) {
        if (token) {
          session.user = {
            id: token.sub,
            username: token.username, // ✅ Ensures username is available
          };
        }
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.username = user.username;
        }
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });