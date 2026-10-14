export function cartLines(cart) {
  return (cart?.lines?.edges || []).map(edge => edge.node).filter(Boolean);
}

export function lineItem(line, quantity = line?.quantity) {
  const variant = line?.merchandise;
  const money = variant?.priceV2 || variant?.price;
  const total = line?.cost?.totalAmount;
  const price = total && line.quantity > 0
    ? Number(total.amount) / line.quantity : Number(money?.amount);
  if (!variant?.id || !Number.isFinite(price) || price < 0 || (!Number.isInteger(quantity) || quantity <= 0)) return null;
  return {
    item_id: String(variant.id),
    item_name: variant.product?.title || variant.title || "Print",
    item_brand: "Trevor Twomey Photo",
    item_category: "Fine Art Print",
    item_variant: variant.title || "Default",
    price,
    quantity,
  };
}

export function cartPayload(cart, lines = cartLines(cart)) {
  if (cart?.lines?.pageInfo?.hasNextPage || lines.length > 200) return null;
  const items = lines.map(line => lineItem(line));
  const currencies = new Set(lines.map(line =>
    line.cost?.totalAmount?.currencyCode || line.merchandise?.priceV2?.currencyCode || line.merchandise?.price?.currencyCode));
  if (!items.length || items.some(item => !item) || currencies.size !== 1 || ![...currencies][0]) return null;
  return {
    currency: [...currencies][0],
    value: Math.round(items.reduce((sum, item) => sum + item.price * item.quantity, 0) * 100) / 100,
    items,
  };
}

export function addedLines(before, after, variantId) {
  const previous = cartLines(before).filter(line => line.merchandise?.id === variantId)
    .reduce((sum, line) => sum + line.quantity, 0);
  const matching = cartLines(after).filter(line => line.merchandise?.id === variantId);
  let remaining = Math.max(0, matching.reduce((sum, line) => sum + line.quantity, 0) - previous);
  return matching.flatMap(line => {
    const quantity = Math.min(line.quantity, remaining);
    remaining -= quantity;
    // Keep the correct per-unit discounted value when reporting only the delta.
    return quantity ? [{...line, quantity, cost: line.cost?.totalAmount ? {
      totalAmount: {...line.cost.totalAmount, amount: String(Number(line.cost.totalAmount.amount) / line.quantity * quantity)}
    } : line.cost}] : [];
  });
}

export function trackCartEvent(event, cart, lines) {
  if (typeof window === "undefined") return;
  const payload = cartPayload(cart, lines);
  if (!payload) return;
  const page_path = window.location.pathname;
  try {
  window.dataLayer = window.dataLayer || [];
  // v2 data-layer variables retain prior values. Clear all ecommerce fields first.
  window.dataLayer.push({items: null, value: null, currency: null, item_id: null, item_name: null, item_variant: null});
  window.dataLayer.push({
    event, ...payload, page_path,
    page_location: window.location.origin + page_path,
    page_type: event === "view_cart" ? "cart" : "storefront",
    event_source: "headless_storefront",
  });
  } catch { /* Analytics must never turn a confirmed cart mutation into a failed UI action. */ }
}

export function navigateToCheckout(cart, owner = "storefront") {
  if (typeof window === "undefined" || !cart?.checkoutUrl || !cartLines(cart).length) return false;
  let target;
  try { target = new URL(cart.checkoutUrl); } catch { return false; }
  if (target.protocol !== "https:") return false;
  const payload = cartPayload(cart);
  if (!payload) { window.location.assign(target.href); return true; }
  const event = owner === "shopify" ? "checkout_click" : "begin_checkout";
  let navigated = false;
  let timer;
  const navigate = () => {
    if (navigated) return;
    navigated = true;
    clearTimeout(timer);
    window.location.assign(target.href);
  };
  timer = setTimeout(navigate, 700);
  try {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({items: null, value: null, currency: null});
  window.dataLayer.push({event, ...payload, event_source: "headless_storefront",
    page_path: window.location.pathname,
    page_location: window.location.origin + window.location.pathname,
    page_type: "checkout", eventCallback: navigate, eventTimeout: 600});
  } catch { /* The navigation timeout still runs if a tag or extension throws. */ }
  return true;
}
