// CartDrawer.js
import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartDrawer = () => {
  const { globalCart } = useShopContext();
  const safeCart = globalCart.items || [];

  return (
    <div className={`cart-drawer ${globalCart.cartOpen ? 'open' : ''}`}>
      {safeCart.length === 0 && <p>Your cart is empty.</p>}
      {safeCart.map((item, index) => ( // Use index as a part of the key
        <div key={`${item.variantId}-${item.quantity}-${index}`} className="cart-item">
          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px' }} />
          <p>{item.title}</p>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default CartDrawer;
