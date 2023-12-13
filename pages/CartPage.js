// CartPage.js
import React from 'react';
import CartDrawer from './CartDrawer'; // Import CartDrawer if you want to use it here

const CartPage = ({ cartItems, onRemoveItem, onCheckout }) => {
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.variant.price * item.quantity, 0);
  };

  return (
    <div className="cart-page">
      <h1>Your Shopping Cart</h1>
      <CartDrawer cartItems={cartItems} />
      <div className="cart-subtotal">
        <strong>Subtotal:</strong> ${calculateSubtotal().toFixed(2)}
      </div>
      <button onClick={onCheckout} className="checkout-button">
        Proceed to Checkout
      </button>
      {cartItems.map(item => (
        <button key={item.id} onClick={() => onRemoveItem(item.id)} className="remove-item-button">
          Remove
        </button>
      ))}
    </div>
  );
};

export default CartPage;
