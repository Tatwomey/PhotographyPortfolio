// pages/checkout.js
import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import { useShopContext } from '@/contexts/shopContext';
import CheckoutForm from '@/components/CheckoutForm';
import Hero from '@/components/Hero';

const CheckoutPage = () => {
    const { globalCart } = useShopContext();
  const cartId = globalCart.cartId;
  const checkoutUrl = globalCart.checkoutUrl;
    const checkoutRef = useRef(null);

    useEffect(() => {
        if (checkoutRef.current) {
            checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleCheckout = async (customerInfo) => {
        // You can use customerInfo here if needed
        if (!globalCart || !globalCart.items) {
            console.error('Cart is null or undefined.');
            return; // Add error handling or redirect to the cart page.
        }

        const lineItems = globalCart.items.map(item => ({
            variantId: btoa(`gid://shopify/ProductVariant/${item.id}`),
            quantity: item.quantity,
        }));

        try {
            const response = await axios.post('/api/shopify-create-checkout', { lineItems });
            window.location.href = response.data.webUrl;
        } catch (error) {
            console.error('Error creating Shopify checkout:', error);
        }
    };

    return (
        <div className='max-w-[1240px] m-auto p-4 min-h-screen'>
            <Hero />
            <h1 className='text-2xl font-bold mb-4' ref={checkoutRef}>
                Checkout ({globalCart.items ? globalCart.items.length : 0} items)
            </h1>
            <div className='max-w-[600px] m-auto'>
                <CheckoutForm onSubmit={handleCheckout} />
                <button
                    onClick={() => handleCheckout()}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                >
                    Proceed to Checkout
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;