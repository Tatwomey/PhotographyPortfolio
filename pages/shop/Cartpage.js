import React from 'react';
import Hero from '@/components/Hero';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import { useShopContext } from '@/contexts/shopContext';

const CartPage = () => {
    const { globalCart } = useShopContext();

    useSmoothScroll();

    const cartItems = globalCart.items || []; // Ensure cartItems is always an array

    return (
        <>
            <Hero />
            <div className="cart-page">
                {cartItems.length === 0 && <p>Your cart is empty.</p>}
                {cartItems.map((item, index) => (
                    <div key={index} className="cart-item">
                        <p>Variant ID: {item.variantId}</p>
                        <p>Product Title: {item.title}</p>
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {item.price}</p>
                        {/* Display image if available */}
                        {item.image && <img src={item.image.src} alt={item.image.alt} />}
                        {/* Add more product details as needed */}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CartPage;
