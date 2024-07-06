import React, { createContext, useContext, useState, useEffect } from 'react';
import { createCart, loadCart, addItemToCart, removeItemFromCart } from '@/lib/shopify';

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);

  useEffect(() => {
    const initializeCart = async () => {
      const storedCartId = localStorage.getItem('shopify_cart_id');
      console.log('Stored Cart ID:', storedCartId);

      if (storedCartId) {
        try {
          const existingCart = await loadCart(storedCartId);
          console.log('Loaded existing cart:', existingCart);
          setCart(existingCart);
        } catch (error) {
          console.error('Failed to load existing cart:', error);
          await createNewCart();
        }
      } else {
        await createNewCart();
      }
    };

    const createNewCart = async () => {
      try {
        const newCart = await createCart();
        console.log('Created new cart:', newCart);
        localStorage.setItem('shopify_cart_id', newCart.cartId);
        setCart(newCart);
      } catch (error) {
        console.error('Failed to create new cart:', error);
      }
    };

    initializeCart();
  }, []);

  const handleAddToCart = async ({ variantId, quantity }) => {
    if (!cart || !cart.id) {
      console.error('Cart or cart ID is not available.');
      return;
    }

    console.log("Adding to cart:", cart.id, variantId, quantity);

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
    <ShopContext.Provider value={{ cart, handleAddToCart, handleRemoveFromCart }}>
      {children}
    </ShopContext.Provider>
  );
}
