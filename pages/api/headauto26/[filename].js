import { readFile } from "node:fs/promises";
import path from "node:path";
import chapters from "../../../data/headauto26.json";
import { canViewHeadAuto, isHeadAutoEnabled } from "../../../utils/headauto26-access.mjs";

import { decryptHeadAutoImage } from "../../../utils/headauto26-images.mjs";

const photos = chapters.flatMap(chapter => chapter.photos).filter(photo => photo.protected);
const textures = ["ink-brush-frame.jpg", "kodak-5063-strip.jpeg", "negative-frame.jpeg"]
  .map(name => ({ export: `texture-${name}`, keyVersion: "mural" }));

export default async function photograph(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (!isHeadAutoEnabled() || !(await canViewHeadAuto(req))) return res.status(404).end();
  if (!["GET", "HEAD"].includes(req.method)) {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const photo = [...photos, ...textures].find(item => item.export === req.query.filename);
  if (!photo) return res.status(404).end();
  let bytes;
  try {
    const encrypted = await readFile(path.join(process.cwd(), "assets", "headauto26", photo.export + ".enc"));
    const key = photo.keyVersion === "nov18" ? process.env.HEADAUTO26_NOV18_KEY :
      photo.keyVersion === "mural" ? process.env.HEADAUTO26_MURAL_KEY :
      photo.keyVersion === "v2" ? process.env.HEADAUTO26_ADDITIONS_V2_KEY :
      photo.keyVersion === "signal" ? process.env.HEADAUTO26_SIGNAL_KEY : process.env.HEADAUTO26_ADDITIONS_KEY;
    bytes = decryptHeadAutoImage(encrypted, photo.export, key);
  } catch {
    return res.status(404).end();
  }
  res.setHeader("Content-Type", "image/jpeg");
  res.setHeader("Content-Length", bytes.length);
  return req.method === "HEAD" ? res.status(200).end() : res.status(200).send(bytes);
}
