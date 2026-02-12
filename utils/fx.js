import { useEffect, useMemo, useState } from "react";

/**
 * Display-only conversion
 * - Shopify stays USD under the hood
 * - We fetch USD→(EUR/GBP) rates and convert for display
 * - Cached in localStorage
 *
 * No API key required:
 * https://open.er-api.com/v6/latest/USD
 */

const FX_CACHE_KEY = "fx_rates_usd_v1";
const FX_CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
const FX_ENDPOINT = "https://open.er-api.com/v6/latest/USD";

function safeParseFloat(v) {
  const n = Number.parseFloat(v);
  return Number.isFinite(n) ? n : 0;
}

function getCachedRates() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(FX_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.ts || !parsed?.rates) return null;
    const age = Date.now() - parsed.ts;
    if (age > FX_CACHE_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function setCachedRates(rates) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      FX_CACHE_KEY,
      JSON.stringify({ ts: Date.now(), rates }),
    );
  } catch {
    // ignore
  }
}

/**
 * Hook: returns conversion rate from USD → targetCurrency
 * - USD => 1
 * - EUR/GBP => fetched + cached
 */
export function useUsdFxRate(targetCurrency = "USD") {
  const [rate, setRate] = useState(1);
  const [loading, setLoading] = useState(targetCurrency !== "USD");

  useEffect(() => {
    let mounted = true;

    async function run() {
      if (targetCurrency === "USD") {
        if (!mounted) return;
        setRate(1);
        setLoading(false);
        return;
      } // cache first

      const cached = getCachedRates();
      if (cached?.rates?.[targetCurrency]) {
        if (!mounted) return;
        setRate(cached.rates[targetCurrency]);
        setLoading(false);
        return;
      } // fetch fallback

      try {
        const res = await fetch(FX_ENDPOINT, { method: "GET" });
        const json = await res.json();

        const rates = json?.rates || json?.conversion_rates || null;
        const next = rates?.[targetCurrency];

        if (rates) setCachedRates(rates);

        if (!mounted) return;

        if (next && Number.isFinite(next)) {
          setRate(next);
        } else {
          // fallback: no rate found
          setRate(1);
        }
      } catch {
        if (!mounted) return;
        setRate(1);
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    setLoading(targetCurrency !== "USD");
    run();

    return () => {
      mounted = false;
    };
  }, [targetCurrency]);

  return { rate, loading };
}

/**
 * Format converted money (display-only).
 * Amount is assumed USD.
 */
export function formatConvertedFromUSD(
  amountUSD,
  currencyCode = "USD",
  rate = 1,
) {
  const usd = safeParseFloat(amountUSD);
  const converted = currencyCode === "USD" ? usd : usd * rate; // Intl formatting for correct separators/decimals
  // Keep it simple: use user's locale by default

  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(converted);
  } catch {
    // fallback formatting
    const sym =
      currencyCode === "EUR" ? "€" : currencyCode === "GBP" ? "£" : "$";
    return `${sym}${converted.toFixed(2)}`;
  }
}

/**
 * Optional: show the raw USD too (small, for transparency).
 */
export function formatUSD(amountUSD) {
  const usd = safeParseFloat(amountUSD);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(usd);
  } catch {
    return `$${usd.toFixed(2)}`;
  }
}
