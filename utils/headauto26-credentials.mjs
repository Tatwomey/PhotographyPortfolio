import { scryptSync, timingSafeEqual } from "node:crypto";
export function authorizeHeadAutoCredentials(credentials) {
  const username=process.env.HEADAUTO26_USERNAME, hash=process.env.HEADAUTO26_PASSWORD_SCRYPT;
  if (process.env.HEADAUTO26_ENABLED!=="true" || !username || credentials?.username!==username || typeof credentials?.password!=="string" || credentials.password.length>1024 || !/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(hash || "")) return null;
  const [salt,expected]=hash.split(":");
  if(!timingSafeEqual(scryptSync(credentials.password,Buffer.from(salt,"hex"),64),Buffer.from(expected,"hex")))return null;
  return {id:"headauto26-band-management",username,allowedPages:["/music/headauto26"]};
}
