import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import CartDrawer from './CartDrawer';

const CartIcon = () => {
  const router = useRouter();
  const { globalCart, cartOpen, setCartOpen } = useShopContext();

  const itemCount = globalCart.lines ? globalCart.lines.edges.reduce((total, { node }) => total + node.quantity, 0) : 0;

  const handleClick = () => {
    router.push('/CartPage');
  };

  return (
    <div className="cart-icon-link" onClick={handleClick}>
      <FaShoppingCart />
      {itemCount > 0 && <span className="cart-icon-badge">{itemCount}</span>}
    </div>
  );
};

export default CartIcon;
