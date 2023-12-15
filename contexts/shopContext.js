import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart } from '../utils/addItemToCart';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
    const [globalCart, setGlobalCart] = useState({ items: [], cartId: null, checkoutUrl: null });
    const [cartOpen, setCartOpen] = useState(false);

    useEffect(() => {
        const storedCartData = localStorage.getItem('cartData');
        if (storedCartData) {
            try {
                const parsedCartData = JSON.parse(storedCartData);
                setGlobalCart(parsedCartData);
            } catch (error) {
                console.error('Error parsing cart data from local storage:', error);
                // Handle the error gracefully, e.g., by resetting the cart or taking appropriate action.
            }
        }
    }, []);

    const updateLocalStorage = (newCartData) => {
        localStorage.setItem('cartData', JSON.stringify(newCartData));
    };

    const addToCart = async (product) => {
        console.log('Product in addToCart:', product);
        try {
            if (!product.variantId || !product.quantity || !product.title || !product.price) {
                console.error('Missing product details');
                return;
            }

            setGlobalCart((prevGlobalCart) => {
                const updatedCartItems = [
                    ...prevGlobalCart.items,
                    {
                        variantId: product.variantId,
                        quantity: product.quantity,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                    },
                ];

                return {
                    ...prevGlobalCart,
                    items: updatedCartItems,
                };
            });

            const updatedCartData = await addItemToCart({
                cartId: globalCart.cartId,
                variantId: product.variantId,
                quantity: product.quantity,
            });

            setGlobalCart((prevGlobalCart) => ({
                ...prevGlobalCart,
                ...updatedCartData,
            }));

            updateLocalStorage({
                ...globalCart,
                items: [
                    ...globalCart.items,
                    {
                        variantId: product.variantId,
                        quantity: product.quantity,
                        title: product.title,
                        price: product.price,
                        image: product.image,
                    },
                ],
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const removeFromCart = async (variantId) => {
        try {
            const updatedItems = globalCart.items.filter((item) => item.variantId !== variantId);
            await removeItemFromCart(globalCart.cartId, variantId);

            setGlobalCart((prevGlobalCart) => ({
                ...prevGlobalCart,
                items: updatedItems,
            }));

            updateLocalStorage({
                ...globalCart,
                items: updatedItems,
            });
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
            console.log('Checkout session:', checkoutSession);
    
            if (checkoutSession && typeof checkoutSession.checkoutUrl === 'string' && checkoutSession.checkoutUrl.startsWith('http')) {
                console.log('Redirecting to:', checkoutSession.checkoutUrl);
                window.location.href = checkoutSession.checkoutUrl;
            } else {
                console.error('Checkout URL is undefined, empty, or checkout failed');
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
