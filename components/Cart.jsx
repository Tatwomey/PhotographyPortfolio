import React, { useEffect, useState } from 'react';
import { useShopContext } from '@/contexts/shopContext';
import { loadCart } from '../utils/load-cart';
import Image from 'next/image';

export default function Cart() {
  const { setGlobalCart } = useShopContext();
  const [cart, setCart] = useState({ id: null, lines: [], checkoutUrl: '', estimatedCost: null });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function getCart() {
      const localCartData = JSON.parse(window.localStorage.getItem('trevortwomeyphoto:Shopify:cart'));
      if (localCartData && localCartData.cartId) {
        const cartData = await loadCart(localCartData.cartId);
        setCart(cartData);
        setGlobalCart(cartData);
      } else {
        const newCartData = await fetch('/api/create-cart').then(res => res.json());
        window.localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(newCartData));
        setCart(newCartData);
        setGlobalCart(newCartData);
      }
    }
    getCart();
  }, [setGlobalCart]);

  function toggleCart() {
    setOpen(!open);
  }

  function emptyCart() {
    window.localStorage.removeItem('trevortwomeyphoto:Shopify:cart');
    setCart({ id: null, lines: [], checkoutUrl: '', estimatedCost: null });
    setGlobalCart({ id: null, lines: [], checkoutUrl: '', estimatedCost: null });
  }

  return (
    <div className="cart">
      <button className="icon" onClick={toggleCart}>
        <Image src="/images/cart.svg" alt="cart" width={20} height={20} />
        <div className="count">{cart.lines.length}</div>
      </button>
      <div className={`drawer ${open ? 'open' : ''}`}>
        <button className="close" onClick={toggleCart}>
          &times; Close
        </button>
        <h3>Your Cart</h3>
        {cart.lines.length > 0 ? (
          <>
            <ul>
              {cart.lines.map(({ node: item }, index) => (
                <li key={index}>
                  <p>
                    {item.quantity} &times; {item.merchandise?.product?.title}
                  </p>
                </li>
              ))}
            </ul>
            <a className="button" href={`${cart.checkoutUrl}?discount=CYBERMON`}>
              Check Out
            </a>
            <button className="empty-cart" onClick={emptyCart}>
              Empty Cart
            </button>
          </>
        ) : (
          <p className="no-items">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
