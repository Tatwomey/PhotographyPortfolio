// pages/api/auth/[...nextauth].js
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
          {
            id: "1",
            username: "braziliangirls",
            password: "sultanroom",
            allowedPages: ["/music/bgbk25"],
          },
          {
            id: "2",
            username: "jcshaffer@me.com",
            password: "Jcshaffer70",
            allowedPages: ["/music/korn24"],
          },
          {
            id: "3",
            username: "sophiabg",
            password: "sultanroom",
            allowedPages: ["/music/bgbk25"],
          },
          {
            id: "7",
            username: "trevor.a.twomey@gmail.com",
            password: "tatwomey",
            allowedPages: [
              "/music/iamx25",
              "/music/korn24",
              "/music/korn2025",
              "/music/dionbk25",
              "/music/bgbk25",
            ],
          },
          {
            id: "8",
            username: "robgarzamusic@gmail.com",
            password: "terminal5",
            allowedPages: ["/music/thievery25"],
          },
          {
            id: "9",
            username: "Taryn@velvethammer.net",
            password: "metlifekornday1",
            allowedPages: ["/music/korn2025"],
          },
        ];

        const user = users.find(
          (u) =>
            u.username === credentials.username &&
            u.password === credentials.password
        );

        if (!user) {
          throw new Error("I think you fucked up.");
        }

        return {
          id: user.id,
          username: user.username,
          allowedPages: user.allowedPages,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      // On first login, copy allowedPages into token
      if (user) {
        token.username = user.username;
        token.allowedPages = user.allowedPages || [];
      }
      return token;
    },
    async session({ session, token }) {
      // Make sure session.user has allowedPages
      session.user = {
        id: token.sub,
        username: token.username,
        allowedPages: token.allowedPages || [],
      };
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      try {
        if (process.env.NODE_ENV === "production" && user?.username) {
          await sendLoginNotification(user.username);
        }
      } catch (err) {
        console.warn("Login email failed (non-blocking):", err?.message || err);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
