import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';

const CartIcon = () => {
  const router = useRouter();
  const { cart } = useShopContext();

  const itemCount = cart && cart.lines && cart.lines.edges 
    ? cart.lines.edges.reduce((total, { node }) => total + node.quantity, 0) 
    : 0;

  const handleClick = () => {
    router.push('/cart#shopping-cart');
  };

  return (
    <div className="cart-icon-link" onClick={handleClick}>
      <FaShoppingCart />
      {itemCount > 0 && <span className="cart-icon-badge">{itemCount}</span>}
    </div>
  );
};

export default CartIcon;
