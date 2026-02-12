// utils/formatMoney.js

import { CURRENCIES } from "@/contexts/CurrencyContext";

export default function formatMoney(amount, currency) {
  if (!amount) return "";

  const numeric = parseFloat(amount);

  return new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(numeric);
}
