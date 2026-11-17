# Natalia Clavier

The existing 13-photo order, cover/six-pair layout, NextAuth permissions and engagement analytics are retained. The expanded viewer offers an individual Small Web JPEG for the selected photo, with no bulk download.

Originals live in `assets/nat26/originals`; they are not public or included in the API function. Display JPEGs have a maximum long edge of 2560px (quality 82). Small Web JPEGs have a 1600px long edge (quality 80). Both preserve aspect ratio, use sRGB, strip metadata, and never upscale. Generated assets are committed; no production encoder or additional service is needed.

To regenerate, make `sharp` available locally and run `node scripts/prepare-nat26-images.cjs`. This is an offline maintenance step, not part of deployment. `next.config.js` traces only display and Small Web JPEGs into the API function.

`/api/nat26/[filename]` enforces the same `/music/nat26` permission as the page. `?download=small-web` returns an attachment with a descriptive filename. All responses are private/no-store; only allowlisted files and GET/HEAD are accepted. Old `/nat26/*.jpg` public paths now return 404 on new deployments. Historical deployments and previously downloaded copies are outside this change.

The download link emits `photo_download` with the existing photo ID, position, portfolio ID, gated flag, `download_size: small_web`, and `click_source: viewer`. This measures clicks, not completion. Existing GTM configuration must forward this event for it to appear in GA4.

## Local verification

- `node --test tests/*.test.mjs`
- `npm run lint -- --file pages/music/nat26.js --file 'pages/api/nat26/[filename].js'`
- `npm run build`, then `npm start -- -p 3100`
- With local `playwright` and `sharp` available, Chrome installed, and `.env.local` configured: `node scripts/test-nat26.cjs`.

The browser check uses short-lived encrypted test sessions locally, blocks external browser requests, checks all 13 downloads and dimensions, unauthorized/wrong-gallery access, removed public URLs, navigation, analytics and 320/390/1440px viewports. No credentials are printed or committed.
