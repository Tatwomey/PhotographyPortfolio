import React, { useEffect } from 'react';
import { useShopContext } from '@/contexts/shopContext';
import Image from 'next/image';
import Link from 'next/link';

const CartDrawer = () => {
  const { globalCart, removeFromCart, cartOpen, setCartOpen } = useShopContext();
  const safeCart = globalCart.items || [];

  let timer;

  const handleMouseEnter = () => {
    clearTimeout(timer);
    setCartOpen(true);
  };

  const handleMouseLeave = () => {
    timer = setTimeout(() => {
      setCartOpen(false);
    }, 3000); // Keep the drawer open for 3 seconds after the mouse leaves
  };

  useEffect(() => {
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`cart-drawer ${cartOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <h3>Your Cart</h3>
      {safeCart.length === 0 ? (
        <p className="no-items">Your cart is empty.</p>
      ) : (
        <>
          <ul>
            {safeCart.map((item, index) => (
              <li key={`${item.variantId}-${index}`} className="cart-item">
                <Image src={item.image} alt={item.title} width={40} height={40} style={{ marginRight: '10px' }} />
                <div>
                  <p>{item.title}</p>
                  <p>Price: ${item.price}</p>
                  <p>Quantity: {item.quantity}</p>
                  <button onClick={() => removeFromCart(item.variantId)} style={{ marginLeft: '10px' }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <Link href={globalCart.checkoutUrl}>
            <button className="button">Proceed to Checkout</button>
          </Link>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
