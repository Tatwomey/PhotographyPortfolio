import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

const page = fs.readFileSync(new URL("../pages/music/nat26.js", import.meta.url), "utf8");
const tracker = fs.readFileSync(new URL("../hooks/useNataliaGalleryAnalytics.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../pages/_app.js", import.meta.url), "utf8");

test("Natalia gallery keeps one cover and six pairs of unique images", () => {
  const names = [...page.matchAll(/\{ file: "([^"]+)"/g)].map((match) => match[1]);
  assert.equal(names.length, 13);
  assert.equal(new Set(names).size, 13);
  assert.equal(names[0], "nat.jpg");
  assert.equal(names.at(-1), "natglitch.jpg");
  assert.match(page, /photos\.slice\(1\)\.map/);
  assert.match(page, /12 photographs \/ 6 pairs/);
});

test("in-page impressions are not confused with fullscreen opens", () => {
  assert.match(page, /useNataliaGalleryAnalytics\(photos\)/);
  assert.match(page, /data-nat26-photo-index="0"/);
  assert.match(page, /data-nat26-photo-index=\{index \+ 1\}/);
  assert.match(tracker, /"photo_impression"/);
  assert.match(tracker, /"photo_section"/);
  assert.match(tracker, /seen\.has\(index\)/);
  assert.match(tracker, /intersectionRatio >= 0\.5/);
  assert.match(tracker, /1000/);
});

test("navigation, viewer dwell, scroll, and foreground milestones are instrumented", () => {
  for (const event of [
    "photo_click", "photo_view", "photo_dwell", "gallery_viewer_navigation",
    "gallery_viewer_close", "gallery_jump_to_photos", "gallery_scroll_depth",
    "gallery_foreground_time", "gallery_end_reached"
  ]) {
    assert.ok(page.includes(event) || tracker.includes(event), event);
  }
  assert.match(tracker, /document\.visibilityState !== "visible"/);
  assert.match(tracker, /document\.hasFocus\(\)/);
});

test("gallery permissions and notification system are left intact", () => {
  assert.match(page, /token\.allowedPages\.includes\("\/music\/nat26"\)/);
  assert.match(page, /destination: "\/login\?callbackUrl=%2Fmusic%2Fnat26"/);
  assert.match(app, /"\/music\/nat26"/);
  assert.doesNotMatch(tracker, /email\b|password\b|session_id\b/i);
});
