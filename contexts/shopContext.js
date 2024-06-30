import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart, removeItemFromCart, createCheckout, createCart, loadCart } from '../lib/shopify';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ items: [], cartId: null, checkoutUrl: null });
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const initializeCart = async () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);
                    if (parsedCart.cartId) {
                        const cartData = await loadCart(parsedCart.cartId);
                        setGlobalCart(cartData);
                    } else {
                        await createNewCart();
                    }
                } catch (error) {
                    console.error('Error parsing stored cart:', error);
                    await createNewCart();
                }
            } else {
                await createNewCart();
            }
        };

        const createNewCart = async () => {
            try {
                const newCartData = await createCart();
                localStorage.setItem('cart', JSON.stringify(newCartData));
                setGlobalCart(newCartData);
            } catch (error) {
                console.error('Error creating new cart:', error);
            }
        };

        initializeCart();
    }, []);

    const updateLocalStorage = (newCartState) => {
        localStorage.setItem('cart', JSON.stringify(newCartState));
    };

    const addToCart = async (product) => {
        try {
            if (!product.variantId || !product.quantity || !product.title || !product.price) {
                console.error('Missing product details');
                return;
            }

            if (!globalCart.cartId) {
                console.error('Cart ID is missing');
                return;
            }

            const updatedCartData = await addItemToCart({
                cartId: globalCart.cartId,
                variantId: product.variantId,
                quantity: product.quantity,
            });

            const newItem = updatedCartData.lines.edges.find(
                (edge) => edge.node.merchandise.id === product.variantId
            ).node;

            setGlobalCart((prevGlobalCart) => ({
                ...prevGlobalCart,
                items: [...(prevGlobalCart.items || []), { ...product, lineId: newItem.id }],
                ...updatedCartData,
            }));

            updateLocalStorage((prevGlobalCart) => ({
                ...prevGlobalCart,
                items: [...(prevGlobalCart.items || []), { ...product, lineId: newItem.id }],
            }));
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (variantId) => {
        try {
            if (!globalCart.cartId) {
                console.error('Cart ID is missing');
                return;
            }

            const itemToRemove = globalCart.items.find((item) => item.variantId === variantId);
            if (!itemToRemove) {
                console.error('Item not found in cart');
                return;
            }

            await removeItemFromCart(globalCart.cartId, itemToRemove.lineId);

            const updatedItems = globalCart.items.filter((item) => item.variantId !== variantId);

            setGlobalCart((prevGlobalCart) => ({
                ...prevGlobalCart,
                items: updatedItems,
            }));

            updateLocalStorage((prevGlobalCart) => ({
                ...prevGlobalCart,
                items: updatedItems,
            }));
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const checkout = async () => {
        try {
            if (!globalCart.items.length) {
                console.error('Cart is empty');
                return;
            }
            const checkoutSession = await createCheckout(globalCart.items);
            if (checkoutSession.checkoutUrl) {
                window.location.href = checkoutSession.checkoutUrl;
            } else {
                console.error('Checkout session not created properly.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
        }
    };

    return (
        <ShopContext.Provider
            value={{
                globalCart,
                setGlobalCart,
                cartOpen,
                setCartOpen,
                addToCart,
                removeFromCart,
                checkout,
            }}
        >
            {children}
        </ShopContext.Provider>
    );
};

export default ShopProvider;
