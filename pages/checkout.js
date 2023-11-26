// pages/checkout.js
import React, { useContext, useEffect, useRef } from 'react';
import axios from 'axios';
import { CartContext } from '@/contexts/CartContext';
import CheckoutForm from '@/components/CheckoutForm';
import Hero from '@/components/Hero';

const CheckoutPage = () => {
    const { cartItems } = useContext(CartContext);
    const checkoutRef = useRef(null);

    useEffect(() => {
        if (checkoutRef.current) {
            checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleCheckout = async (customerInfo) => {
        // You can use customerInfo here if needed
        const lineItems = cartItems.map(item => ({
            variantId: btoa(`gid://shopify/ProductVariant/${item.variantId}`),
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
            <h1 className='text-2xl font-bold mb-4' ref={checkoutRef}>Checkout ({cartItems.length} items)</h1>
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
