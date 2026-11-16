import { createDecipheriv } from "node:crypto";

export function decryptHeadAutoImage(payload, filename, key = process.env.HEADAUTO26_ADDITIONS_KEY) {
  if (!/^[0-9a-f]{64}$/i.test(key ?? "") || payload.length < 29) throw new Error("Invalid gallery image configuration");
  const cipher = createDecipheriv("aes-256-gcm", Buffer.from(key, "hex"), payload.subarray(0, 12));
  cipher.setAAD(Buffer.from(filename));
  cipher.setAuthTag(payload.subarray(12, 28));
  return Buffer.concat([cipher.update(payload.subarray(28)), cipher.final()]);
}
