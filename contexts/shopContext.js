import React, { createContext, useContext, useState, useEffect } from 'react';
import { createCart, loadCart, addItemToCart, removeItemFromCart } from '@/lib/shopify';

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [cartInitialized, setCartInitialized] = useState(false);

  const refreshCart = async () => {
    const storedCartId = localStorage.getItem('shopify_cart_id');
    if (storedCartId) {
      try {
        const existingCart = await loadCart(storedCartId);
        setCart(existingCart);
      } catch (error) {
        console.error('Failed to load existing cart:', error);
        await createNewCart();
      }
    } else {
      await createNewCart();
    }
    setCartInitialized(true);
  };

  const createNewCart = async () => {
    try {
      const newCart = await createCart();
      localStorage.setItem('shopify_cart_id', newCart.cartId);
      setCart(newCart);
    } catch (error) {
      console.error('Failed to create new cart:', error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  const handleAddToCart = async ({ variantId, quantity }) => {
    if (!cart || !cart.id) {
      console.error('Cart or cart ID is not available.');
      return;
    }

    try {
      const updatedCart = await addItemToCart({ cartId: cart.id, variantId, quantity });
      setCart(updatedCart);
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };

  const handleRemoveFromCart = async (lineId) => {
    if (!cart || !cart.id) return;

    try {
      const updatedCart = await removeItemFromCart(cart.id, lineId);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  return (
    <ShopContext.Provider value={{ cart, handleAddToCart, handleRemoveFromCart, cartInitialized, refreshCart }}>
      {children}
    </ShopContext.Provider>
  );
}
