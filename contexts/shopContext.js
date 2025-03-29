// contexts/shopContext.js
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createCart,
  fetchCart,
  removeItemFromCart,
  addItemToCart,
  updateCartItemQuantity,
} from "@/lib/shopify";

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [initialized, setInitialized] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const createNewCart = useCallback(async () => {
    try {
      const newCart = await createCart();
      window.localStorage.setItem("shopify_cart_id", newCart.id);
      setCart(newCart);
      setCartId(newCart.id);
      return newCart.id;
    } catch (error) {
      console.error("Error creating new cart:", error);
      return null;
    }
  }, []);

  const initializeCart = useCallback(async () => {
    const storedCartId = window.localStorage.getItem("shopify_cart_id");
    if (storedCartId) {
      try {
        const cartData = await fetchCart(storedCartId);
        if (cartData && cartData.id) {
          setCart(cartData);
          setCartId(storedCartId);
        } else {
          await createNewCart();
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        await createNewCart();
      }
    } else {
      await createNewCart();
    }
    setLoading(false);
  }, [createNewCart]);

  useEffect(() => {
    if (!initialized) {
      initializeCart();
      setInitialized(true);
    }
  }, [initialized, initializeCart]);

  const refreshCart = useCallback(async () => {
    if (!cartId) return;
    try {
      const cartData = await fetchCart(cartId);
      setCart(cartData);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }, [cartId]);

  const handleAddToCart = async (variantId, quantity) => {
    setLoading(true);
    try {
      const currentCartId = cartId || await createNewCart();
      await addItemToCart({ cartId: currentCartId, variantId, quantity });
      await refreshCart();
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (item) => {
    setLoading(true);
    try {
      if (item.quantity > 1) {
        const updatedCart = await updateCartItemQuantity(cartId, item.id, item.quantity - 1);
        setCart(updatedCart);
      } else {
        await removeItemFromCart(cartId, item.id);
        await refreshCart();
      }
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider value={{
      cart,
      loading,
      handleAddToCart,
      handleRemoveFromCart,
      refreshCart,
      isCartOpen,
      toggleCart
    }}>
      {children}
    </ShopContext.Provider>
  );
};
