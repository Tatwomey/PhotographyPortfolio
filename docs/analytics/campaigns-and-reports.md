# Campaign naming and reporting

Use lowercase UTM values with underscores. Never include names, email addresses, phone numbers, customer IDs, or other personal data. Apply UTMs to external campaign links only, not internal navigation.

| Field | Convention | Example |
| --- | --- | --- |
| utm_source | Sending platform | klaviyo, instagram, facebook |
| utm_medium | Channel | email, organic_social, paid_social |
| utm_campaign | Collection and purpose | capsule_01_launch |
| utm_content | Placement or creative | email_01_hero |

Example: https://www.trevortwomeyphoto.com/capsule-01?utm_source=klaviyo&utm_medium=email&utm_campaign=capsule_01_launch&utm_content=email_01_hero

Record each live link in campaign-links.csv before publishing a campaign. Existing links in sent email/social posts were not edited by this code change.

## Reporting definitions

- Product funnel: view_item -> add_to_cart -> begin_checkout -> purchase. Keep this core funnel for Buy Now paths that bypass cart viewing. Create a separate cart-view funnel including view_cart for drawer/cart-page users; inserting a required cart view into the core funnel would incorrectly drop direct Buy Now shoppers.
- Traffic comparison: session source/medium and campaign by sessions, engaged sessions, generate_lead key events, purchases, purchase revenue. Keep first-user source/medium as a separate acquisition analysis; do not blend user and session attribution.
- Collector retention: purchaser cohorts by first purchase month with repeat purchasers/revenue at 30/60/90 days. Validate purchase delivery before interpreting results. Cross-device collection requires a separate consent-aware identity design; email hashes are not a substitute.
- AI referrals: source/medium comparisons for observed AI referral domains. Missing referrers can land in direct traffic, so this is a measured baseline, not total AI discovery.
- Audiences created in GA4: Print viewers (30 days), Cart prospects (30 days), Checkout prospects (7 days), Print waitlist submissions (90 days), explicit Korn preference (90 days). Prospect audiences permanently exclude purchase matches from audience evaluation; they are not timed cart-abandonment lists or all-history customer suppression.

These report definitions are implementation guidance, not a claim that new GA4 explorations or dashboard reports have been saved. Existing Print Product Funnel remains intact. BigQuery is pending the owner's decision; no billing or export settings were changed.
