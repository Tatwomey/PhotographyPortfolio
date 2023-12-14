import React, { useRef } from 'react';
import Link from 'next/link'; // Import the Link component
import { useShopContext } from '@/contexts/shopContext'; // Import useShopContext
import { useSmoothScroll } from '@/hooks/useSmoothScroll'; // Import useSmoothScroll
import Hero from '@/components/Hero'; // Import the Hero component

const CartPage = ({ onCheckout }) => {
  const { globalCart } = useShopContext(); // Access the global cart
  const safeCart = globalCart.items || []; // Ensure safeCart is always an array

  const checkoutRef = useRef(null);

  // Attach smooth scroll behavior to the checkout button
  useSmoothScroll('#checkout', checkoutRef);

  return (
    <div>
      <Hero /> {/* Include the Hero component at the top */}
      <div className="cart-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="cart-items-column">
          {safeCart.length === 0 && <p>Your cart is empty.</p>}
          {safeCart.map((item, index) => (
            <div key={`${item.variantId}-${item.quantity}-${index}`} className="cart-item" style={{ display: 'flex', marginBottom: '10px' }}>
              <img src={item.image} alt={item.title} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
              <div>
                <p>{item.title}</p>
                <p>Price: ${item.price}</p>
                <p>Quantity: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="cart-summary-column">
          {/* Link the button to the /checkout page */}
          <Link href="/checkout" className="checkout-button" id="checkout">
              Proceed to Checkout
            
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
