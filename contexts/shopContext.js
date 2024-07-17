import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createCart,
  fetchCart,
  removeItemFromCart,
  addItemToCart,
  updateCartItemQuantity
} from "@/lib/shopify";

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState(null);
  const [initialized, setInitialized] = useState(false);

  const createNewCart = useCallback(async () => {
    try {
      const newCart = await createCart();
      window.localStorage.setItem("shopify_cart_id", newCart.id);
      setCart(newCart);
      setCartId(newCart.id);
      console.log("Created new cart:", newCart);
    } catch (error) {
      console.error("Error creating new cart:", error);
    }
  }, []);

  const initializeCart = useCallback(async () => {
    const storedCartId = window.localStorage.getItem("shopify_cart_id");
    console.log("Initializing cart with stored cart ID:", storedCartId);
    if (storedCartId) {
      try {
        const cartData = await fetchCart(storedCartId);
        if (cartData && cartData.id) {
          setCart(cartData);
          setCartId(storedCartId);
          console.log("Fetched existing cart:", cartData);
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
    console.log("Refreshing cart with ID:", cartId);
    try {
      const cartData = await fetchCart(cartId);
      setCart(cartData);
      console.log("Refreshed cart data:", cartData);
    } catch (error) {
      console.error("Error refreshing cart:", error);
    }
  }, [cartId]);

  const handleAddToCart = async (variantId, quantity) => {
    console.log("Adding item to cart:", { variantId, quantity });
    try {
      setLoading(true);
      if (!cartId) {
        await createNewCart();
      }
      await addItemToCart({ cartId, variantId, quantity });
      await refreshCart();
      setLoading(false);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (item) => {
    console.log("Removing item from cart:", item);
    try {
      setLoading(true);
      if (item.quantity > 1) {
        const updatedCart = await updateCartItemQuantity(cartId, item.id, item.quantity - 1);
        setCart(updatedCart);
      } else {
        await removeItemFromCart(cartId, item.id);
        await refreshCart();
      }
      setLoading(false);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
      setLoading(false);
    }
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        loading,
        handleAddToCart,
        handleRemoveFromCart,
        refreshCart,
      }}>
      {children}
    </ShopContext.Provider>
  );
}
