import React, { createContext, useContext, useState } from 'react';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({});

    const addToCart = async (product) => {
        // Replace this with your actual logic to add a product to the cart
        const updatedCart = { ...globalCart };
        updatedCart.items = [...(updatedCart.items || []), product];
        setGlobalCart(updatedCart);
        return updatedCart;
    };

    return (
        <ShopContext.Provider value={{ globalCart, setGlobalCart, addToCart }}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopContext;
