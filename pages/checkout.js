import React, { useRef, useEffect } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import { useShopContext } from '@/contexts/shopContext';
import Hero from "@/components/Hero";

const CheckoutPage = () => {
    const { globalCart, updateCart } = useShopContext();
    const checkoutRef = useRef(null);

    useEffect(() => {
        // Smooth scroll to the checkout form on component mount
        if (checkoutRef.current) {
            checkoutRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleCheckoutSubmit = async (customerInfo, cartItems) => {
        const processedCartItems = cartItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
        }));

        try {
            const response = await fetch('/api/shopify-create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineItems: processedCartItems, buyerInfo: customerInfo })
            });

            const data = await response.json();

            if (response.ok && data.checkoutUrl) {
                window.location.href = data.checkoutUrl;
            } else {
                console.error('Checkout error:', data.error ? data.error : 'No checkout URL');
            }
        } catch (error) {
            console.error('Checkout submission error:', error);
        }
    };

    return (
        <>
            <Hero />
            <div ref={checkoutRef} style={{ paddingTop: '80px' }}> {/* Adjust paddingTop based on navbar height */}
                <CheckoutForm onSubmit={handleCheckoutSubmit} cartItems={globalCart.items} />
            </div>
        </>
    );
};

export default CheckoutPage;
