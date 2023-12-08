import React from 'react';
import { useRouter } from 'next/router';
import { FaShoppingCart } from 'react-icons/fa';
import { useShopContext } from '@/contexts/shopContext';
import CartDrawer from './CartDrawer';

const CartIcon = () => {
  const router = useRouter();
  const { globalCart, cartOpen, setCartOpen } = useShopContext();

  // Calculate total item count
  const itemCount = globalCart.items.reduce((total, item) => total + item.quantity, 0);

  const handleCartIconClick = () => {
    router.push('/shop/CartPage');
  };

  const handleHover = () => {
    setCartOpen(true);
  };

  const handleHoverLeave = () => {
    setCartOpen(false);
  };

  return (
    <div className="cart-icon-link" onMouseEnter={handleHover} onMouseLeave={handleHoverLeave}>
      <FaShoppingCart onClick={handleCartIconClick} />
      {itemCount > 0 && <span className="cart-icon-badge">{itemCount}</span>}
      {cartOpen && <CartDrawer />}
    </div>
  );
};

export default CartIcon;
