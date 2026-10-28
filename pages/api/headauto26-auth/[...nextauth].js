import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authorizeHeadAutoCredentials } from "../../../utils/headauto26-credentials.mjs";
export default NextAuth({
 providers: [CredentialsProvider({name: "Head Automatica", credentials: {username: {label: "Username", type: "text"}, password: {label: "Password", type: "password"}}, authorize: async credentials => authorizeHeadAutoCredentials(credentials)})],
 pages: {signIn: "/headauto26-login"},
 session: {strategy: "jwt"},
 callbacks: {
  async jwt({token,user}) {if(user){token.username=user.username;token.allowedPages=user.allowedPages;}return token;},
  async session({session,token}) {session.user={id:token.sub,username:token.username,allowedPages:token.allowedPages || []};return session;}
 },
 secret: process.env.NEXTAUTH_SECRET
});
