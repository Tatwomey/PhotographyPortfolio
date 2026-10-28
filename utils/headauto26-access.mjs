import { getToken } from "next-auth/jwt";
export const galleryPath = "/music/headauto26";
export const isHeadAutoEnabled = () => process.env.HEADAUTO26_ENABLED === "true";
export async function canViewHeadAuto(req) {
 if (!process.env.NEXTAUTH_SECRET) return false;
 const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
 return Boolean(token && Array.isArray(token.allowedPages) && token.allowedPages.includes(galleryPath));
}
