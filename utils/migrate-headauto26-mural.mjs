// One-time migration for the remaining public, currently selected exports.
// Run from the repository root. Never commit the generated local environment file.
import fs from "node:fs";
import path from "node:path";
import { createCipheriv, createHash, randomBytes } from "node:crypto";
import { decryptHeadAutoImage } from "./headauto26-images.mjs";

const manifest = "data/headauto26.json";
const keyFile = ".env.headauto26-mural.local";
const chapters = JSON.parse(fs.readFileSync(manifest, "utf8"));
const photos = chapters.flatMap(c => c.photos).filter(p => !p.protected);
if (!photos.length) throw new Error("No currently selected public exports to migrate.");
if (fs.existsSync(keyFile)) throw new Error("Existing migration key file; refusing to overwrite.");
const key = randomBytes(32).toString("hex");
const outputs = photos.map(photo => {
  const source = path.join("public/headauto26", photo.export);
  const destination = path.join("assets/headauto26", photo.export + ".enc");
  if (fs.existsSync(destination)) throw new Error("Encrypted destination exists: " + photo.export);
  const plain = fs.readFileSync(source);
  if (createHash("sha256").update(plain).digest("hex") !== photo.sha256) throw new Error("Source checksum differs: " + photo.export);
  const nonce = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", Buffer.from(key, "hex"), nonce);
  cipher.setAAD(Buffer.from(photo.export));
  const encrypted = Buffer.concat([cipher.update(plain), cipher.final()]);
  const payload = Buffer.concat([nonce, cipher.getAuthTag(), encrypted]);
  if (!decryptHeadAutoImage(payload, photo.export, key).equals(plain)) throw new Error("Encrypted output verification failed");
  return { photo, source, destination, payload };
});
fs.writeFileSync(keyFile, "HEADAUTO26_MURAL_KEY=" + key + "\n", { mode: 0o600, flag: "wx" });
for (const { photo, destination, payload } of outputs) {
  fs.writeFileSync(destination, payload, { flag: "wx" });
  photo.protected = true;
  photo.keyVersion = "mural";
}
fs.writeFileSync(manifest, JSON.stringify(chapters, null, 2) + "\n");
// The checked-in original exports remain recoverable through existing Git history.
for (const { source } of outputs) fs.unlinkSync(source);
console.log(`Migrated ${outputs.length} selected exports; original checksums verified. New key is stored in the ignored local environment file.`);
