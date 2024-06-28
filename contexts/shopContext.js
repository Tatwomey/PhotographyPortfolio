import React, { createContext, useContext, useState, useEffect } from 'react';
import { createCheckout, removeFromCart } from '../lib/shopify';

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
      }
    }
  }, []);

  const updateLocalStorage = (newCartData) => {
    localStorage.setItem('cartData', JSON.stringify(newCartData));
  };

  const addToCart = (product) => {
    const updatedCart = {
      ...globalCart,
      items: [...globalCart.items, product],
    };
    setGlobalCart(updatedCart);
    updateLocalStorage(updatedCart);
  };

  const removeFromCartHandler = async (variantId) => {
    const updatedItems = globalCart.items.filter((item) => item.variantId !== variantId);
    try {
      const updatedCartData = await removeFromCart({ cartId: globalCart.cartId, lineId: variantId });
      setGlobalCart((prevCart) => ({
        ...prevCart,
        items: updatedItems,
      }));
      updateLocalStorage(updatedCartData);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const checkout = async () => {
    try {
      const checkoutData = await createCheckout(globalCart.items);
      setGlobalCart((prevCart) => ({
        ...prevCart,
        checkoutUrl: checkoutData.checkoutUrl,
      }));
      window.location.href = checkoutData.checkoutUrl;
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
        removeFromCartHandler,
        checkout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export default ShopProvider;
