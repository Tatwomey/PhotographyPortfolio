import React, { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { useShopContext } from "@/contexts/shopContext";
import Link from "next/link";

const CartIcon = () => {
  const { cart } = useShopContext(); // ✅ Uses the correct context hook
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true); // ✅ Prevents SSR hydration issues
  }, []);

  // ✅ Ensure cart is always an array to prevent `null` errors
  const cartCount = Array.isArray(cart) ? cart.length : 0;

  return (
    <div className="cart-icon-link cursor-pointer flex items-center">
      <Link href="/shop">
        <BsCart3 size={28} className="text-white" />
      </Link>
      {/* ✅ Only show badge if cart has items */}
      {hydrated && cartCount > 0 && (
        <span className="cart-icon-badge">{cartCount}</span>
      )}
    </div>
  );
};

export default CartIcon;
