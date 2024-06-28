import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartDrawer = () => {
  const { globalCart, removeFromCartHandler, checkout } = useShopContext();
  const safeCart = globalCart.items || [];

  return (
    <div className={`cart-drawer ${globalCart.cartOpen ? 'open' : ''}`}>
      {safeCart.length === 0 && <p>Your cart is empty.</p>}
      {safeCart.map((item, index) => (
        <div key={`${item.variantId}-${index}`} className="cart-item">
          <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px' }} />
          <p>{item.title}</p>
          <p>Price: ${item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <button onClick={() => removeFromCartHandler(item.variantId)}>Remove</button>
        </div>
      ))}
      <button onClick={() => checkout()}>
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartDrawer;
