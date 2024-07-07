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

  const refreshCart = async (currentCartId) => {
    try {
      let cartData;
      if (!currentCartId) {
        console.log("No cart ID found, creating a new cart...");
        cartData = await createCart();
        window.localStorage.setItem('shopify_cart_id', cartData.id);
        setCartId(cartData.id);
        console.log(`New cart ID created and stored: ${cartData.id}`);
      } else {
        console.log(`Fetching cart with ID: ${currentCartId}`);
        cartData = await fetchCart(currentCartId);
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
      console.log(`Adding item to cart: variantId=${variantId}, quantity=${quantity}`);
      let currentCartId = cartId;
      if (!currentCartId) {
        console.log("No cart ID found, creating a new cart...");
        const newCart = await createCart();
        window.localStorage.setItem('shopify_cart_id', newCart.id);
        currentCartId = newCart.id;
        setCartId(newCart.id);
        console.log(`New cart ID created and stored: ${newCart.id}`);
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
      console.log(`Removing item from cart: itemId=${itemId}`);
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
    console.log(`Stored cart ID: ${storedCartId}`);
    if (storedCartId) {
      console.log(`Setting cart ID to: ${storedCartId}`);
      setCartId(storedCartId);
      refreshCart(storedCartId);
    } else {
      refreshCart(null);
    }
  }, []); // Only run once when the component mounts

  useEffect(() => {
    if (cartId && cartId !== window.localStorage.getItem('shopify_cart_id')) {
      console.log(`Updating localStorage with cart ID: ${cartId}`);
      window.localStorage.setItem('shopify_cart_id', cartId);
    }
  }, [cartId]);

  return (
    <ShopContext.Provider value={{ cart, loading, handleAddToCart, handleRemoveFromCart, refreshCart }}>
      {children}
    </ShopContext.Provider>
  );
}
