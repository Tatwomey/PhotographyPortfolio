import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  createCart,
  fetchCart,
  removeItemFromCart,
  addItemToCart,
} from "@/lib/shopify";

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cartId, setCartId] = useState(null);
  const [cartInitialized, setCartInitialized] = useState(false);

  const refreshCart = useCallback(async (currentCartId) => {
    setLoading(true);
    try {
      let cartData;
      if (!currentCartId) {
        console.log("No cart ID found, creating a new cart...");
        cartData = await createCart();
        window.localStorage.setItem("shopify_cart_id", cartData.id);
        setCartId(cartData.id);
        console.log(`New cart ID created and stored: ${cartData.id}`);
      } else {
        console.log(`Fetching cart with ID: ${currentCartId}`);
        cartData = await fetchCart(currentCartId);
      }

      if (!cartData || !cartData.id) {
        throw new Error("Invalid cart data");
      }

      setCart(cartData);
      setCartInitialized(true);
      console.log("Cart successfully refreshed:", cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAddToCart = async (variantId, quantity) => {
    setLoading(true);
    try {
      let currentCartId = cartId;
      if (!currentCartId) {
        console.log("No cart ID found, creating a new cart...");
        const newCart = await createCart();
        window.localStorage.setItem("shopify_cart_id", newCart.id);
        currentCartId = newCart.id;
        setCartId(newCart.id);
        console.log(`New cart ID created and stored: ${newCart.id}`);
      }

      await addItemToCart({ cartId: currentCartId, variantId, quantity });
      await refreshCart(currentCartId);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    setLoading(true);
    try {
      if (!cartId) throw new Error("Cart ID not found in localStorage");
      await removeItemFromCart(cartId, itemId);
      await refreshCart(cartId);
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedCartId = window.localStorage.getItem("shopify_cart_id");
    console.log(`Stored cart ID: ${storedCartId}`);
    if (storedCartId) {
      setCartId(storedCartId);
      refreshCart(storedCartId);
    } else {
      refreshCart(null);
    }
  }, [refreshCart]);

  return (
    <ShopContext.Provider
      value={{
        cart,
        loading,
        handleAddToCart,
        handleRemoveFromCart,
        refreshCart,
        cartInitialized,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}
