import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartDrawer = () => {
  const { cart } = useShopContext();

  // Ensure cart is always an array, default to an empty array if undefined
  const safeCart = cart || [];

  return (
    <div className="cart-drawer">
      {safeCart.length === 0 && <p>Your cart is empty.</p>}
      {safeCart.map(item => (
        <div key={item.id} className="cart-item">
          <p>Product ID: {item.id}</p>
          <p>Quantity: {item.quantity}</p>
          {/* Add more product details as needed */}
        </div>
      ))}
    </div>
  );
};

export default CartDrawer;
