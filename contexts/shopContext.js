import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, fetchCart, removeItemFromCart, addItemToCart } from '@/lib/shopify';

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshCart = async () => {
    try {
      const cartId = window.localStorage.getItem('shopify_cart_id');
      let cartData;
      if (!cartId) {
        console.log("No cart ID found, creating a new cart...");
        cartData = await createCart();
        window.localStorage.setItem('shopify_cart_id', cartData.id);
      } else {
        console.log(`Fetching cart with ID: ${cartId}`);
        cartData = await fetchCart(cartId);
      }
      if (!cartData || !cartData.id) {
        throw new Error('Invalid cart data');
      }
      setCart(cartData);
      setLoading(false);
      console.log("Cart successfully refreshed:", cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
      setLoading(false);
    }
  };

  const handleAddToCart = async (variantId, quantity) => {
    try {
      setLoading(true);
      const cartId = window.localStorage.getItem('shopify_cart_id');
      if (!cartId) {
        console.log("No cart ID found, creating a new cart...");
        const newCart = await createCart();
        window.localStorage.setItem('shopify_cart_id', newCart.id);
        await addItemToCart({ cartId: newCart.id, variantId, quantity });
        await refreshCart();
      } else {
        await addItemToCart({ cartId, variantId, quantity });
        await refreshCart();
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setLoading(true);
      const cartId = window.localStorage.getItem('shopify_cart_id');
      if (!cartId) throw new Error("Cart ID not found in localStorage");
      await removeItemFromCart(cartId, itemId);
      await refreshCart();
      setLoading(false);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []); // Only run once when the component mounts

  return (
    <ShopContext.Provider value={{ cart, loading, handleAddToCart, handleRemoveFromCart, refreshCart }}>
      {children}
    </ShopContext.Provider>
  );
}
