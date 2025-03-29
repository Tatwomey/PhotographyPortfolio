import React, { useState, useEffect } from "react";
import { BsCart3 } from "react-icons/bs";
import { useShopContext } from "/contexts/shopContext";

const CartIcon = () => {
  const { cart, toggleCart } = useShopContext();
  const [hydrated, setHydrated] = useState(false);
  const cartCount = cart?.lines?.edges?.length || 0;

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <div className="cart-icon-link cursor-pointer flex items-center relative" onClick={toggleCart}>
      <BsCart3 size={28} className="text-white" />
      {hydrated && cartCount > 0 && (
        <span className="cart-icon-badge">{cartCount}</span>
      )}
    </div>
  );
};

export default CartIcon;
