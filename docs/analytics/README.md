# Analytics foundation

GA4: G-H3MT6ZKKN4. GTM: GTM-M3ZGLXGX.

## Event contract

| Event | Source and meaning | Required values |
| --- | --- | --- |
| add_to_cart | Shared cart context, only after Shopify confirms the mutation | Actual quantity added, items, currency, value |
| remove_from_cart | Shared cart context, only after confirmed quantity decrease | Removed quantity and its prior price |
| view_cart | Once per drawer opening or cart-page visit with items | Full cart items, currency, value |
| begin_checkout | Storefront checkout handoff, when storefront owns the event | Full confirmed cart; valid HTTPS checkout URL |
| checkout_click | Handoff when Shopify owns begin_checkout | Same full-cart payload; diagnostic event |
| generate_lead | Klaviyo submit for form SyxgXY only | signup_status=submitted, lead_type=print_waitlist, lead_context=capsule_01 |
| artist_interest | Explicit supported form preference | band_interest user property: korn, staind, iamx, thievery_corporation |

Cart item_id uses Shopify ProductVariant GIDs, matching the existing product-detail emitter. Values use Shopify's returned line totals and currency, not the display currency selector. GA4 values exclude shipping and tax. Analytics is skipped for invalid/mixed currencies, incomplete paginated carts, or more than 200 lines, rather than emitting incorrect totals. Cart navigation still works if tags are blocked; the fallback delay is 700ms.

Email/phone values are never copied to the new events. `email_submitted` and `sms_submitted` are booleans indicating fields present in the submit event. Neither is proof of marketing consent or double opt-in. Artist preference is optional and explicitly allowlisted. No new identity tracking or consent defaults are introduced.

## Checkout ownership — release gate

Inspect Shopify Settings > Customer events and any Google/YouTube channel integration before production deployment. Exactly one system should send begin_checkout to this GA4 property:

- `NEXT_PUBLIC_CHECKOUT_EVENT_OWNER=storefront` (default): the shared storefront handoff emits begin_checkout.
- `NEXT_PUBLIC_CHECKOUT_EVENT_OWNER=shopify`: the storefront emits checkout_click; Shopify must emit begin_checkout.

This is a public build-time setting; rebuild when changing it. Never enable both implementations. Purchase remains owned by the existing Shopify/checkout integration; this change adds no purchase emitter. Confirm its transaction_id deduplication, matching variant IDs, currency, value, and session continuity with an authorized test order.

The local checkout has no Shopify environment settings. The code compiled, but a complete production build could not collect product page data without NEXT_PUBLIC_SHOPIFY_DOMAIN and NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN. Use the existing hosting environment or a preview with those settings; never commit secrets. The repository still pins API 2023-10; no API upgrade is included. Updated cart operations were schema-validated against 2026-01, the oldest version available from the validator, not the retired pinned version.

## Verification before deploying

Run `npm run test:analytics` and targeted lint. In a preview using the prepared GTM workspace, check:

1. Failed add: visible error, no add_to_cart, no checkout navigation.
2. Each add entry point: one event only, correct returned variant and quantity.
3. Two different products and quantity >1: add/remove deltas correct; checkout contains all cart items.
4. Drawer close/reopen and cart page: one view_cart per view; mutations do not emit additional views.
5. Popup quick view: one opening event; variant/image changes do not emit another opening.
6. All Buy Now, drawer, cart and /checkout paths: one handoff with a working fallback when GTM is blocked.
7. Klaviyo intended form: one submission event; other forms/open/step events ignored. Inspect the real payload's preference key. Confirm email/SMS status with Klaviyo separately.
8. Hard load and client-side route: one actual GA4 page_view each. Existing enhanced measurement remains the owner; no extra page-view tag was added.
9. Shopify purchase and consent: reconcile an authorized test order, transaction ID, values and cross-domain session; no duplicate purchase/start events.

Unit tests exercise payloads, quantity deltas, invalid currencies, checkout navigation and fallback, lead field allowlisting and Shopify userErrors. They do not establish real browser delivery to GA4.

## Rollback

Revert this code commit and redeploy the prior successful site build. GTM version 19 is the configuration baseline; publish that version to roll back a later GTM release. GA4 dimensions, audiences and key events are prospective and do not rewrite history. Do not delete existing reporting data to undo a configuration change.


### Shopify purchase pixel (2026-10-14)
The connected GA4 Purchase Pixel was updated and reloaded to verify its saved source matches `integrations/shopify/ga4-purchase-pixel.js`. It subscribes only to `checkout_completed`; storefront remains the begin_checkout owner. Unit price is line total divided by quantity. Purchase value uses subtotal excluding shipping/tax and preserves zero-value orders. Invalid money/quantities and missing stable order identifiers are skipped. Checkout query strings are excluded from the purchase page_location override.

Run `npm run test:analytics` for 14 tests, including the pixel sandbox fixture. This is not an end-to-end paid-order test. Order-level discount allocation and consent/GA4 receipt still need a controlled checkout validation. Both Vercel previews passed builds for commit 5095f8c; preview add-to-cart was verified.
