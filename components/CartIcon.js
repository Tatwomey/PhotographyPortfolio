import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useShopContext } from '../contexts/shopContext';
import CartDrawer from './CartDrawer';

const CartIcon = () => {
  const { cart, cartOpen, setCartOpen, cartLoading, removeFromCart } = useShopContext();

  // Check if cart and cart.lines are defined before accessing edges
  const itemCount = cart && cart.lines && Array.isArray(cart.lines.edges)
    ? cart.lines.edges.reduce((total, item) => total + item.node.quantity, 0)
    : 0;

  const handleCartIconClick = (e) => {
    e.preventDefault(); // Prevent anchor tag default behavior
    if (setCartOpen) { // Check if setCartOpen is available
      setCartOpen(!cartOpen);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <a className='cart-icon-link' href="/shop/cartpage" onClick={handleCartIconClick}>
        <FaShoppingCart />
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
      </a>
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => {
          if (setCartOpen) { // Check if setCartOpen is available
            setCartOpen(false);
          }
        }}
        cartLoading={cartLoading}
        removeFromCart={removeFromCart}
      />
    </div>
  );
};

export default CartIcon;
