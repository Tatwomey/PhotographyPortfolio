import React, { useRef, useEffect } from 'react';
import { useShopContext } from '@/contexts/shopContext';
import Hero from "@/components/Hero";

const CheckoutPage = () => {
  const { cart, handleCheckout } = useShopContext();
  const checkoutRef = useRef(null);

  useEffect(() => {
    if (checkoutRef.current) {
      checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && cart?.checkoutUrl) {
      window.location.href = cart.checkoutUrl;
    }
  }, [cart?.checkoutUrl]);

  const handleCheckoutSubmit = async () => {
    try {
      const checkoutUrl = await handleCheckout();
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      }
    } catch (error) {
      console.error('Checkout submission error:', error);
    }
  };

  return (
    <>
      <Hero />
      <div ref={checkoutRef} style={{ paddingTop: '80px' }}>
        <button onClick={handleCheckoutSubmit}>
          Complete Checkout
        </button>
      </div>
    </>
  );
};

export default CheckoutPage;
