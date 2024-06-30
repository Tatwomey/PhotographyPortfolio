import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartItem = ({ item }) => {
  const { removeFromCart } = useShopContext();

  return (
    <div className="cart-item">
      <div className="item-details">
        <span className="item-name">{item.name}</span>
        <span className="item-price">${item.price}</span>
      </div>
      <div className="item-actions">
        <button className="remove-btn" onClick={() => removeFromCart(item.variantId)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;

