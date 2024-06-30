import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart, removeItemFromCart, createCheckout, createCart, loadCart } from '../lib/shopify';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ lines: { edges: [] }, cartId: null, checkoutUrl: null });
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const initializeCart = async () => {
            const storedCart = localStorage.getItem('cart');
            if (storedCart) {
                try {
                    const parsedCart = JSON.parse(storedCart);
                    if (parsedCart.cartId) {
                        const cartData = await loadCart(parsedCart.cartId);
                        setGlobalCart({ ...cartData, cartId: parsedCart.cartId });
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

            const newCartState = {
                ...globalCart,
                lines: updatedCartData.lines,
                items: [...globalCart.lines.edges.map(edge => edge.node), { ...product, lineId: newItem.id }]
            };

            setGlobalCart(newCartState);
            updateLocalStorage(newCartState);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (lineId) => {
        try {
            if (!globalCart.cartId) {
                console.error('Cart ID is missing');
                return;
            }

            const updatedCartData = await removeItemFromCart(globalCart.cartId, lineId);

            const updatedItems = globalCart.lines.edges.filter(
                (edge) => edge.node.id !== lineId
            ).map(edge => edge.node);

            const newCartState = {
                ...globalCart,
                lines: updatedCartData.lines,
                items: updatedItems
            };

            setGlobalCart(newCartState);
            updateLocalStorage(newCartState);
        } catch (error) {
            console.error('Error removing from cart:', error);
        }
    };

    const checkout = async () => {
        try {
            if (!globalCart.lines.edges.length) {
                console.error('Cart is empty');
                return;
            }
            const checkoutSession = await createCheckout(globalCart.lines.edges.map(edge => edge.node));
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
