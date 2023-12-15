import React, { useRef, useEffect } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import { useShopContext } from '@/contexts/shopContext';

const CheckoutPage = () => {
    const { globalCart, updateCart } = useShopContext();
    const cartItems = globalCart.items; // Retrieve cart items from globalCart
    const checkoutRef = useRef(null);

    const handleCheckoutSubmit = async (customerInfo, cartItems) => {
        // Format cart items for the API call
        const lineItems = cartItems.map(item => ({
            variantId: item.variantId,
            quantity: item.quantity
        }));

        try {
            // Make an API call to your shopify-create-checkout endpoint
            const response = await fetch('/api/shopify-create-checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lineItems, buyerInfo: customerInfo })
            });

            const data = await response.json();
            console.log('Full response from server:', data);

            if (response.ok && data.checkoutUrl) {
                console.log('Redirecting to:', data.checkoutUrl); // Confirming the URL before redirect
                window.location.href = data.checkoutUrl;
                
            } else {
                // Handle errors, show message to the user
                console.error('Checkout error:', data.error ? data.error : 'No checkout URL');
            }
        } catch (error) {
            console.error('Checkout submission error:', error);
            // Handle errors, show message to the user
        }
    };

    useEffect(() => {
        // Focus on the first input field when the component mounts
        if (checkoutRef.current) {
            const firstInput = checkoutRef.current.querySelector('input');
            if (firstInput) {
                firstInput.focus();
            }
        }
    }, []);

    return (
        <div ref={checkoutRef}>
            <CheckoutForm
                onSubmit={handleCheckoutSubmit}
                cartItems={cartItems}
                onChange={(updatedInfo) => {
                    // Check if updateCart is a function before calling it
                    if (typeof updateCart === 'function') {
                        updateCart({ ...globalCart, customerInfo: updatedInfo });
                    } else {
                        console.error('updateCart is not a function in ShopContext');
                    }
                }}
            />
        </div>
    );
};

export default CheckoutPage;
