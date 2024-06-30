import React, { useRef } from 'react';
import Link from 'next/link';
import { useShopContext } from '@/contexts/shopContext';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Hero from '@/components/Hero';
import Image from 'next/image';

const CartPage = () => {
  const { globalCart, removeFromCart } = useShopContext();
  const safeCart = globalCart.items || [];
  const checkoutRef = useRef(null);

  useSmoothScroll('#checkout', checkoutRef);

  return (
    <div>
      <Hero />
      <div className="cart-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cart-items-column">
          {safeCart.length === 0 && <p>Your cart is empty.</p>}
          {safeCart.map((item, index) => (
            <div key={`${item.variantId}-${item.quantity}-${index}`} className="cart-item" style={{ display: 'flex', marginBottom: '10px' }}>
              <Image src={item.image} alt={item.title} width={50} height={50} style={{ marginRight: '10px' }} />
              <div>
                <p>{item.title}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
                <button className="remove-btn" onClick={() => removeFromCart(item.variantId)} style={{ marginLeft: '10px' }}>Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-column">
          <Link href="/checkout">
            <button className="checkout-button" id="checkout" ref={checkoutRef}>Proceed to Checkout</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

