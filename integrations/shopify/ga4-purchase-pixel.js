// GTM Purchase Pixel for headless Shopify Storefront API checkout
// Purpose: send one GA4 purchase event when Shopify checkout completes.
// Flow: Shopify checkout_completed → dataLayer.push("purchase") → GTM → GA4

const GTM_CONTAINER_ID = "GTM-M3ZGLXGX";

window.dataLayer = window.dataLayer || [];

// Load Google Tag Manager inside Shopify's Customer Events pixel sandbox
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js",
  });

  const firstScript = d.getElementsByTagName(s)[0];
  const gtmScript = d.createElement(s);
  const dataLayerParam = l !== "dataLayer" ? "&l=" + l : "";

  gtmScript.async = true;
  gtmScript.src =
    "https://www.googletagmanager.com/gtm.js?id=" + i + dataLayerParam;

  if (firstScript?.parentNode) firstScript.parentNode.insertBefore(gtmScript, firstScript);
  else (d.head || d.documentElement).appendChild(gtmScript);
})(window, document, "script", "dataLayer", GTM_CONTAINER_ID);

function getLineItems(checkout) {
  const lineItems = checkout?.lineItems || [];

  return lineItems.map((lineItem) => {
    const variant = lineItem?.variant || {};
    const product = variant?.product || {};

    const quantity = Number(lineItem?.quantity);
    const lineTotal = lineItem?.finalLinePrice?.amount;
    const unitPrice = variant?.price?.amount;
    const price = lineTotal != null ? Number(lineTotal) / quantity : Number(unitPrice);
    if (!Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price) || price < 0) return null;

    return {
      item_id: String(variant?.id || product?.id || lineItem?.id || ""),
      item_name: product?.title || lineItem?.title || "",
      item_brand: "Trevor Twomey Photo",
      item_category: "Fine Art Print",
      item_variant: variant?.title || "",
      price,
      quantity,
    };
  }).filter(Boolean);
}

analytics.subscribe("checkout_completed", (event) => {
  const checkout = event?.data?.checkout || {};

  const transactionId =
    checkout?.order?.id ||
    checkout?.token ||
    "";

  const currency =
    checkout?.currencyCode ||
    checkout?.totalPrice?.currencyCode ||
    checkout?.subtotalPrice?.currencyCode ||
    "USD";

  // Shopify subtotal excludes shipping, duties and tax and includes checkout discounts.
  // Keep zero (a fully discounted order) rather than falling back to the gross total.
  const subtotal = checkout?.subtotalPrice?.amount;
  const value = subtotal == null ? null : Number(subtotal);
  if (value == null || !Number.isFinite(value) || value < 0) return;

  const shipping =
    Number(
      checkout?.shippingLine?.price?.amount ||
        checkout?.shippingLine?.price ||
        0
    ) || 0;

  const tax = Number(checkout?.totalTax?.amount || checkout?.totalTax || 0) || 0;

  const items = getLineItems(checkout);
  if (!transactionId || !items.length || items.length !== (checkout.lineItems || []).length) return;

  window.dataLayer.push({items: null, value: null, currency: null, transaction_id: null, tax: null, shipping: null});
  window.dataLayer.push({
    event: "purchase",
    transaction_id: String(transactionId),
    value,
    tax,
    shipping,
    currency,
    items,
    page_type: "shopify_checkout_thank_you",
    page_location: (event?.context?.window?.location?.origin || "") + "/checkout/thank-you",
    page_path: "/checkout/thank-you",
  });
});