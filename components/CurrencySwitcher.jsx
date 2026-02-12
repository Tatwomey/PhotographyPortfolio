import { useCurrency, CURRENCIES } from "@/contexts/CurrencyContext";
import { useState, useRef, useEffect } from "react";

export default function CurrencySwitcher({ isDarkMode = false }) {
  const { currency, setCurrency } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const textColor = isDarkMode ? "text-white" : "text-black";
  const borderColor = isDarkMode ? "border-white/20" : "border-black/10";
  const dropdownBg = isDarkMode ? "bg-black text-white" : "bg-white text-black";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`text-sm font-medium tracking-wide ${textColor} hover:opacity-70 transition`}
        aria-haspopup="menu"
        aria-expanded={open}>
        {currency} {CURRENCIES[currency].symbol} ▾
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 min-w-[90px] border ${borderColor} rounded-md shadow-lg z-[9999] ${dropdownBg}`}>
          {Object.keys(CURRENCIES).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCurrency(c);
                setOpen(false);
              }}
              className="block w-full px-3 py-2 text-sm text-left hover:bg-black/5 dark:hover:bg-white/10 transition">
              {c} {CURRENCIES[c].symbol}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
