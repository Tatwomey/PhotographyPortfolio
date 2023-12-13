import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart, removeItemFromCart as removeFromCartShopify } from '../utils/addItemToCart';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ items: [], cartId: null, checkoutUrl: null });
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            setGlobalCart(JSON.parse(storedCart));
        }
    }, []);

    const updateLocalStorage = (newCartState) => {
        localStorage.setItem('cart', JSON.stringify(newCartState));
    };

    const addToCart = async (product) => {
        console.log('Product in addToCart:', product);
        try {
            if (!product.variantId || !product.quantity || !product.title || !product.price) {
                console.error('Missing product details');
                return;
            }

            const updatedCartItems = [...globalCart.items, {
                variantId: product.variantId,
                quantity: product.quantity,
                title: product.title,
                price: product.price,
                image: product.image,
            }];

            const updatedCartData = await addItemToCart({ 
                cartId: globalCart.cartId, 
                variantId: product.variantId, 
                quantity: product.quantity 
            });

            const updatedCartState = { ...globalCart, items: updatedCartItems, ...updatedCartData };
            setGlobalCart(updatedCartState);

            // Update localStorage after state change
            updateLocalStorage(updatedCartState);

        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            const updatedItems = globalCart.items.filter(item => item.variantId !== itemId);

            // Perform API call if necessary
            if (globalCart.cartId) {
                await removeFromCartShopify({ cartId: globalCart.cartId, lineId: itemId });
            }

            const updatedCartState = { ...globalCart, items: updatedItems };
            setGlobalCart(updatedCartState);

            // Update localStorage after state change
            updateLocalStorage(updatedCartState);

        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    return (
        <ShopContext.Provider value={{ globalCart, setGlobalCart, cartOpen, setCartOpen, addToCart, removeFromCart }}>
            {children}
        </ShopContext.Provider>
    );
};

export default ShopProvider;
