import React from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartItem = ({ item }) => {
  const { handleRemoveFromCart } = useShopContext();

  return (
    <div className="cart-item">
      <div className="item-details">
        <span className="item-name">{item.merchandise.product.title}</span>
        <span className="item-price">${item.merchandise.priceV2.amount}</span>
        <span className="item-quantity">Quantity: {item.quantity}</span>
      </div>
      <div className="item-actions">
        <button className="remove-btn" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
      </div>
    </div>
  );
};

export default CartItem;

