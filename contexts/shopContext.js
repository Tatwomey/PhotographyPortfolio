// shopContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart } from '../utils/addItemToCart'; // Import your utility function for adding items to cart

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ items: [], cartId: null, checkoutUrl: null });
    const [cartOpen, setCartOpen] = useState(false); // State for cart visibility

    // Load cart from localStorage when component mounts (client-side)
    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setGlobalCart(JSON.parse(storedCart));
        }
    }, []);

    // Define addToCart function here
    const addToCart = async (product) => {
        try {
            // Assuming product contains the necessary ID and quantity
            const updatedCart = await addItemToCart({ 
                cartId: globalCart.cartId, 
                itemId: product.id, 
                quantity: product.variantQuantity 
            });
            setGlobalCart(updatedCart); // Update the global cart state
        } catch (error) {
            console.error('Error adding to cart:', error);
            // Handle error appropriately
        }
    };

    return (
        <ShopContext.Provider value={{ globalCart, setGlobalCart, cartOpen, setCartOpen, addToCart }}>
            {children}
        </ShopContext.Provider>
    );
};
