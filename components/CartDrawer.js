// CartDrawer.js
import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartDrawer = () => {
  const { globalCart } = useShopContext();
  const safeCart = globalCart.items || [];

  return (
    <div className={`cart-drawer ${globalCart.cartOpen ? 'open' : ''}`}>
      {safeCart.length === 0 && <p>Your cart is empty.</p>}
      {safeCart.map(item => (
        <div key={item.id} className="cart-item">
          <img src={item.image.src} alt={item.image.alt} /> {/* Image icon */}
          <p>Product ID: {item.id}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default CartDrawer;
