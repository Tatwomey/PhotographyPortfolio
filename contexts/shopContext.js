import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart, createCart, loadCart, removeItemFromCart, updateCheckout } from '@/lib/shopify';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localCartData = JSON.parse(window.localStorage.getItem('trevortwomeyphoto:Shopify:cart'));
    if (localCartData && localCartData.cartId) {
      handleLoadCart(localCartData.cartId);
    }
  }, []);

  const handleAddToCart = async ({ variantId, quantity, title, price, image }) => {
    setLoading(true);
    setError(null);
    try {
      let updatedCart;
      const localCart = JSON.parse(window.localStorage.getItem('trevortwomeyphoto:Shopify:cart'));
      if (localCart && localCart.cartId) {
        updatedCart = await addItemToCart({ cartId: localCart.cartId, variantId, quantity });
      } else {
        const newCartData = await createCart();
        updatedCart = await addItemToCart({ cartId: newCartData.cartId, variantId, quantity });
      }
      window.localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(updatedCart));
      setCart(updatedCart);
      console.log('Cart updated:', updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Error adding to cart');
    }
    setLoading(false);
  };

  const handleRemoveFromCart = async (lineId) => {
    setLoading(true);
    setError(null);
    try {
      if (!cart || !cart.id) {
        throw new Error('Cart ID is missing');
      }
      const updatedCart = await removeItemFromCart(cart.id, lineId);
      setCart(updatedCart);
      window.localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(updatedCart));
      console.log('Cart updated:', updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Error removing from cart');
    }
    setLoading(false);
  };

  const handleLoadCart = async (cartId) => {
    setLoading(true);
    setError(null);
    try {
      const loadedCart = await loadCart(cartId);
      setCart(loadedCart);
      window.localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(loadedCart));
      console.log('Cart loaded:', loadedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError('Error loading cart');
    }
    setLoading(false);
  };

  return (
    <ShopContext.Provider value={{ cart, loading, error, handleAddToCart, handleRemoveFromCart, handleLoadCart }}>
      {children}
    </ShopContext.Provider>
  );
};
