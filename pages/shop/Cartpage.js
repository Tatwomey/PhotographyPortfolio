import React from 'react';
import Hero from '@/components/Hero';
import useSmoothScroll from '@/hooks/useSmoothScroll';
import { useShopContext } from '@/contexts/shopContext';

const CartPage = () => {
    const { cart } = useShopContext();
    useSmoothScroll();

    return (
        <>
            <Hero />
            <div className="cart-page">
                {cart.length === 0 && <p>Your cart is empty.</p>}
                {cart.map(item => (
                    <div key={item.id} className="cart-item">
                        <p>Product ID: {item.id}</p>
                        <p>Quantity: {item.quantity}</p>
                        {/* Add more product details as needed */}
                    </div>
                ))}
            </div>
        </>
    );
};

export default CartPage;
