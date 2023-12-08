import React, { createContext, useContext, useState, useEffect } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ items: [] });
    const [cartOpen, setCartOpen] = useState(false); // State for cart visibility

    // Load cart from localStorage when component mounts (client-side)
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCart = localStorage.getItem('trevortwomeyphoto:Shopify:cart');
            if (savedCart) {
                setGlobalCart(JSON.parse(savedCart));
            }
        }
    }, []);

    // Update localStorage when globalCart changes
    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(globalCart));
        }
    }, [globalCart]);

    const addToCart = async (product) => {
        const updatedCart = { ...globalCart };
        const existingItemIndex = updatedCart.items.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            updatedCart.items[existingItemIndex].quantity += 1;
        } else {
            updatedCart.items.push({ ...product, quantity: 1 });
        }

        setGlobalCart(updatedCart);
    };

    const removeFromCart = (productId) => {
        const updatedCart = { ...globalCart };
        updatedCart.items = updatedCart.items.filter(item => item.id !== productId);

        setGlobalCart(updatedCart);
    };

    return (
        <ShopContext.Provider value={{ globalCart, addToCart, removeFromCart, cartOpen, setCartOpen }}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContext;
