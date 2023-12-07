import React, { useContext } from 'react';
import { useShopContext } from '@/contexts/shopContext';

const CartPage = () => {
  const { cart, removeFromCart } = useShopContext();

  return (
    <div className="cart-page">
      {cart.length > 0 ? (
        cart.map((item) => (
          <div key={item.id}>
            <p>
              {item.quantity} x {item.name} {/* Assuming 'name' is the item's name */}
            </p>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartPage;
