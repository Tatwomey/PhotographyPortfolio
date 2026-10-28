import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeHeadAutoCredentials } from "../../../utils/headauto26-credentials.mjs";
import nodemailer from "nodemailer";

const sendLoginNotification = async (username) => {
 const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD},
 });
 await transporter.sendMail({
  from: '"Login Notifier" <info@trevortwomeyphoto.com>',
  to: process.env.EMAIL_USER,
  subject: `New Login - ${username}`,
  text: `${username} just logged in.`,
 });
};

export default NextAuth({
 providers: [CredentialsProvider({name: "Head Automatica", credentials: {username: {label: "Username", type: "text"}, password: {label: "Password", type: "password"}}, authorize: async credentials => authorizeHeadAutoCredentials(credentials)})],
 pages: {signIn: "/headauto26-login"},
 session: {strategy: "jwt"},
 callbacks: {
  async jwt({token,user}) {if(user){token.username=user.username;token.allowedPages=user.allowedPages;}return token;},
  async session({session,token}) {session.user={id:token.sub,username:token.username,allowedPages:token.allowedPages || []};return session;}
 },
 events: {
  async signIn({user}) {
   try {
    if (process.env.NODE_ENV === "production" && user?.username) {
     await sendLoginNotification(user.username);
    }
   } catch (err) {
    console.warn("Login email failed (non-blocking):", err?.message || err);
   }
  },
 },
 secret: process.env.NEXTAUTH_SECRET
});
