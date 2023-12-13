// CartPage.js
import React from 'react';
import CartDrawer from '@/components/CartDrawer'; // Adjust import path


const CartPage = ({ onCheckout }) => {
  return (
    <div className="cart-page">
      <div className="cart-items-column">
        <CartDrawer />
      </div>
      <div className="cart-summary-column">
        
        <button onClick={onCheckout} className="checkout-button">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
