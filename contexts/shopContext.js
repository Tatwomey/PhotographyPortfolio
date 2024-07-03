import React, { createContext, useContext, useState } from 'react';
import { addItemToCart, createCart, loadCart, removeItemFromCart, updateCheckout } from '@/lib/shopify';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAddToCart = async ({ variantId, quantity, title, price, image }) => {
    setLoading(true);
    setError(null);
    try {
      let updatedCart;
      if (cart && cart.id) {
        updatedCart = await addItemToCart({ cartId: cart.id, variantId, quantity });
      } else {
        updatedCart = await createCart();
        updatedCart = await addItemToCart({ cartId: updatedCart.cartId, variantId, quantity });
      }
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
