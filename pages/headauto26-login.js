import Head from "next/head";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { canViewHeadAuto } from "../utils/headauto26-access.mjs";
export async function getServerSideProps({req,res}) {
 res.setHeader("Cache-Control","private, no-store");res.setHeader("X-Robots-Tag","noindex, nofollow");
 if(await canViewHeadAuto(req)) return {redirect:{destination:"/headauto26",permanent:false}};
 return {props:{}};
}
export default function HeadAutoLogin() {
 const [error,setError]=useState("");const [busy,setBusy]=useState(false);
 async function submit(event) {
  event.preventDefault();setBusy(true);setError("");
  try {
   const form=new FormData(event.currentTarget);
   // Use the same NextAuth endpoint as the rest of the private galleries.
   const result = await signIn("credentials", {
    redirect: false,
    username: String(form.get("username") || ""),
    password: String(form.get("password") || ""),
    callbackUrl: "/music/headauto26",
   });
   if (!result?.ok || result.error) throw new Error("Unable to authenticate.");
   window.location.assign("/music/headauto26");
  } catch {setError("Unable to sign in. Check your username and password.");setBusy(false);}
 }
 return <><Head><title>Head Automatica — Private Viewing</title><meta name="robots" content="noindex,nofollow" /></Head><main className="min-h-screen flex items-center justify-center bg-black text-white px-6"><form onSubmit={submit} className="w-full max-w-sm space-y-5 border border-gray-700 p-8"><p className="text-xs uppercase tracking-widest text-gray-400">Trevor Twomey Photography</p><h1 className="text-2xl">Head Automatica</h1><p className="text-sm text-gray-400">Private viewing · Band &amp; management</p><label className="block">Username<input name="username" autoComplete="username" required className="block w-full mt-2 p-3 bg-white text-black" /></label><label className="block">Password<input name="password" type="password" autoComplete="current-password" required className="block w-full mt-2 p-3 bg-white text-black" /></label>{error&&<p role="alert" className="text-red-300">{error}</p>}<button disabled={busy} className="w-full border border-gray-500 p-3">{busy?"Signing in…":"View lookbook"}</button></form></main></>;
}
