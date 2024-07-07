import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, fetchCart, removeItemFromCart, addItemToCart } from '@/lib/shopify';

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);

  const refreshCart = async (cartId) => {
    try {
      let cartData;
      if (!cartId) {
        console.log("No cart ID found, creating a new cart...");
        cartData = await createCart();
        window.localStorage.setItem('shopify_cart_id', cartData.id);
        setCartId(cartData.id);
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
      let currentCartId = cartId;
      if (!currentCartId) {
        console.log("No cart ID found, creating a new cart...");
        const newCart = await createCart();
        window.localStorage.setItem('shopify_cart_id', newCart.id);
        currentCartId = newCart.id;
        setCartId(newCart.id);
      }
      await addItemToCart({ cartId: currentCartId, variantId, quantity });
      await refreshCart(currentCartId);
      setLoading(false);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      setLoading(true);
      if (!cartId) throw new Error("Cart ID not found in localStorage");
      await removeItemFromCart(cartId, itemId);
      await refreshCart(cartId);
      setLoading(false);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCartId = window.localStorage.getItem('shopify_cart_id');
    if (storedCartId) {
      setCartId(storedCartId);
      refreshCart(storedCartId);
    } else {
      refreshCart(null);
    }
  }, []); // Only run once when the component mounts

  return (
    <ShopContext.Provider value={{ cart, loading, handleAddToCart, handleRemoveFromCart, refreshCart }}>
      {children}
    </ShopContext.Provider>
  );
}
