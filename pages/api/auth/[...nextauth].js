import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nodemailer from "nodemailer";

const sendLoginNotification = async (username) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Login Notifier" <info@trevortwomeyphoto.com>',
    to: process.env.EMAIL_USER,
    subject: `New Login - ${username}`,
    text: `${username} just logged in.`,
  };

  await transporter.sendMail(mailOptions);
};

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Client Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const users = [
          { id: "1", username: "rayloser2025", password: "korntour2024", allowedPages: ["/music/korn24"] },
          { id: "2", username: "jcshaffer@me.com", password: "Jcshaffer70", allowedPages: ["/music/korn24"] },
          { id: "3", username: "jefffranca", password: "Thievery25", allowedPages: ["/music/thievery25"] },
          { id: "4", username: "sunyaboy", password: "sunyaboy", allowedPages: ["/music/thievery25"] },
          { id: "5", username: "munkshaffer", password: "korntour2024", allowedPages: ["/music/korn24"] },
          { id: "6", username: "toddytodd", password: "thankstodd!", allowedPages: ["/music/korn24"] },
          { id: "7", username: "robgarzamusic@gmail.com", password: "terminal5!", allowedPages: ["/music/thievery25"] },
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
    async session({ session, token }) {
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
  events: {
    async signIn({ user }) {
      if (user?.username) {
        await sendLoginNotification(user.username);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});