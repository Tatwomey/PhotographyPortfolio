import React, { useContext } from 'react';
import { FaShoppingCart } from 'react-icons/fa'; // Correct import for the shopping cart icon
import { CartContext } from '@/contexts/CartContext';
import CartDrawer from '@/components/CartDrawer'; // Assuming you have a CartDrawer component

const CartIcon = () => {
  const { cartItems } = useContext(CartContext);
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div style={{ position: 'relative' }}>
      <FaShoppingCart /> {/* Shopping cart icon */}
      {itemCount > 0 && (
        <span style={{
          position: 'absolute',
          top: 0,
          right: 0,
          background: 'red',
          borderRadius: '50%',
          color: 'white',
          padding: '2px 6px',
          fontSize: '0.8rem'
        }}>
          {itemCount}
        </span>
      )}
      <CartDrawer />
    </div>
  );
};

export default CartIcon;
