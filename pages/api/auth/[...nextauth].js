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
          { id: "2", username: "Themazzeoshow2025", password: "Themazzeoshow2025", allowedPages: ["/music/korn24"] },
          { id: "3", username: "jefffranca", password: "Thievery25", allowedPages: ["/music/thievery25"] },
          { id: "4", username: "sunyaboy", password: "sunyaboy", allowedPages: ["/music/thievery25"] }

        ];

        const user = users.find(
            (u) => u.username === credentials.username && u.password === credentials.password
          );
  
          if (user) {
            return { id: user.id, username: user.username, allowedPages: user.allowedPages };
          } else {
            throw new Error("I think you fucked up.");
          }
        },
      }),
    ],
    pages: {
      signIn: "/login",
    },
    callbacks: {
      async session({ session, user, token }) {
        session.user = {
          id: token.sub,
          username: token.username,
          allowedPages: token.allowedPages || [],
        };
        return session;
      },
      async jwt({ token, user }) {
        if (user) {
          token.username = user.username;
          token.allowedPages = user.allowedPages;
        }
        return token;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  });