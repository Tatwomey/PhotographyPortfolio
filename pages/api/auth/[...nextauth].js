import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import nodemailer from "nodemailer";
import { authorizeHeadAutoCredentials } from "../../../utils/headauto26-credentials.mjs";

// Send email notification when a user logs in
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
        // Reuse the existing, scrypt-verified Head Automatica account.
        const headAutoUser = authorizeHeadAutoCredentials(credentials);
        if (headAutoUser) return headAutoUser;

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
              "/music/nat26",
            ],
          },
          {
            id: "8",
            username: "we@iamxmusic.com",
            password: "iamxlprnyc",
            allowedPages: ["/music/iamx25"],
          },
          {
            id: "9",
            username: "dion",
            password: "unionpool25",
            allowedPages: ["/music/dionbk25"],
          },

          // Natalia Clavier — private gallery
          ...(process.env.NAT26_USERNAME && process.env.NAT26_PASSWORD
            ? [
                {
                  id: "nat26-client",
                  username: process.env.NAT26_USERNAME,
                  password: process.env.NAT26_PASSWORD,
                  allowedPages: ["/music/nat26"],
                },
              ]
            : []),
        ];

        const user = users.find(
          (u) =>
            u.username === credentials?.username &&
            u.password === credentials?.password,
        );

        if (!user) {
          return null;
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

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username;
        token.allowedPages = user.allowedPages || [];
      }

      return token;
    },

    async session({ session, token }) {
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
