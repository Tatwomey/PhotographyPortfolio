// contexts/shopContext.js
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
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

  // ✅ Explicit controls (best for modals / Buy Now flows)
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((prev) => !prev), []);

  /**
   * Create a new cart and immediately fetch full cart data
   * so checkoutUrl/lines shape is consistent.
   */
  const createNewCart = useCallback(async () => {
    try {
      const newCart = await createCart(); // returns { id } from your lib
      window.localStorage.setItem("shopify_cart_id", newCart.id);
      setCartId(newCart.id);

      // ✅ fetch full cart details (checkoutUrl, lines, etc.)
      const fullCart = await fetchCart(newCart.id);
      setCart(fullCart);

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

  /**
   * ✅ IMPORTANT: return the fetched cart so callers (QuickView Buy Now)
   * can immediately use the freshest checkoutUrl.
   */
  const refreshCart = useCallback(async () => {
    if (!cartId) return null;
    try {
      const cartData = await fetchCart(cartId);
      setCart(cartData);
      return cartData; // ✅ critical
    } catch (error) {
      console.error("Error refreshing cart:", error);
      return null;
    }
  }, [cartId]);

  const handleAddToCart = useCallback(
    async (variantId, quantity) => {
      setLoading(true);
      try {
        const currentCartId = cartId || (await createNewCart());
        if (!currentCartId) return;

        await addItemToCart({ cartId: currentCartId, variantId, quantity });

        // refresh and return it (even if you don't use it everywhere)
        await refreshCart();
      } catch (error) {
        console.error("Failed to add item to cart:", error);
      } finally {
        setLoading(false);
      }
    },
    [cartId, createNewCart, refreshCart]
  );

  const handleRemoveFromCart = useCallback(
    async (item) => {
      setLoading(true);
      try {
        if (!cartId) return;

        if (item.quantity > 1) {
          const updatedCart = await updateCartItemQuantity(
            cartId,
            item.id,
            item.quantity - 1
          );
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
    },
    [cartId, refreshCart]
  );

  return (
    <ShopContext.Provider
      value={{
        cart,
        loading,
        handleAddToCart,
        handleRemoveFromCart,
        refreshCart,

        isCartOpen,
        toggleCart,
        openCart,
        closeCart,
      }}>
      {children}
    </ShopContext.Provider>
  );
};
