import { useEffect, useState, useRef } from "react";

const CURRENCIES = {
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function CurrencySwitcher() {
  const [currency, setCurrency] = useState("USD");
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("currency");
    if (saved) setCurrency(saved);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function changeCurrency(next) {
    setCurrency(next);
    localStorage.setItem("currency", next);
    window.dispatchEvent(new Event("currency-change"));
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="text-sm font-medium tracking-wide px-2 py-1 rounded hover:opacity-70 transition">
        {currency} {CURRENCIES[currency]} ▾
      </button>

      {open && (
        <div className="absolute right-0 mt-2 bg-white text-black border border-black/10 rounded shadow-lg z-[9999]">
          {Object.keys(CURRENCIES).map((c) => (
            <button
              key={c}
              onClick={() => changeCurrency(c)}
              className="block w-full text-left px-3 py-2 text-sm hover:bg-black/5">
              {c} {CURRENCIES[c]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
