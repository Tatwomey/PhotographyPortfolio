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
        // ✅ Define users and their allowed pages
        const users = [
          { id: "1", username: "rayloser2025", password: "rayloser2025", allowedPages: ["/music/korn24"] },
          { id: "2", username: "themazzeoshow2025", password: "themazzeoshow2025", allowedPages: ["/music/korn24"] },
          { id: "3", username: "jefffranca", password: "Thievery25", allowedPages: ["/music/thievery25"] }
        ];

        const user = users.find(
            (u) => u.username === credentials.username && u.password === credentials.password
          );
  
          if (user) {
            return user; // ✅ Pass user data, including allowed pages
          } else {
            throw new Error("Invalid username or password");
          }
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async session({ session, user }) {
        if (user) {
          session.user.allowedPages = user.allowedPages; // ✅ Add allowed pages to session
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });