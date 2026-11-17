import { readFile } from "node:fs/promises";
import path from "node:path";
import { getToken } from "next-auth/jwt";
import files from "../../../data/nat26-files.json";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "private, no-store");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const token = process.env.NEXTAUTH_SECRET
    ? await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    : null;
  if (!Array.isArray(token?.allowedPages) || !token.allowedPages.includes("/music/nat26")) {
    return res.status(401).end();
  }
  const { filename, download } = req.query;
  if (typeof filename !== "string" || !files.includes(filename) ||
      (download !== undefined && download !== "small-web")) {
    return res.status(404).end();
  }
  const variant = download === "small-web" ? "small-web" : "display";
  try {
    const image = await readFile(path.join(process.cwd(), "assets", "nat26", variant, filename));
    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", image.length);
    if (download) {
      res.setHeader("Content-Disposition", 'attachment; filename="Natalia-Clavier-' + filename.replace(/\.jpg$/, "-small-web.jpg") + '"');
    }
    return req.method === "HEAD" ? res.status(200).end() : res.status(200).send(image);
  } catch (error) {
    return res.status(error.code === "ENOENT" ? 404 : 500).end();
  }
}
