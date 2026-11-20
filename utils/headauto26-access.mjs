import { getToken } from "next-auth/jwt";
export const galleryPath = "/music/headauto26";
export const isHeadAutoEnabled = () => process.env.HEADAUTO26_ENABLED === "true";
export async function canViewHeadAuto(req) {
 // Production-only temporary public viewing; unset or set false to restore login.
 const host = (req.headers?.host || "").toLowerCase();
 if (isHeadAutoEnabled() && process.env.HEADAUTO26_PUBLIC === "true" &&
     ["trevortwomeyphoto.com", "www.trevortwomeyphoto.com"].includes(host)) return true;
 if (!process.env.NEXTAUTH_SECRET) return false;
 const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 return Boolean(token && Array.isArray(token.allowedPages) && token.allowedPages.includes(galleryPath));
}
