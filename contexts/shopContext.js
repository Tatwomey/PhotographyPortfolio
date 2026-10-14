import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { createCart, fetchCart, removeItemFromCart, addItemToCart, updateCartItemQuantity } from "@/lib/shopify";
import { addedLines, cartLines, navigateToCheckout, trackCartEvent } from "@/lib/ecommerce.mjs";

const ShopContext = createContext();
export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const currentCart = useRef(null);
  const busy = useRef(false);
  const checkingOut = useRef(false);
  const initialized = useRef(false);
  const [loading, setLoading] = useState(true);
  const [cartError, setCartError] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen(prev => !prev), []);
  const remember = useCallback(next => {
    currentCart.current = next;
    setCart(next);
    if (next?.id) {
      try { window.localStorage.setItem("shopify_cart_id", next.id); } catch { /* Storage may be blocked. */ }
    }
    return next;
  }, []);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    busy.current = true;
    (async () => {
      try {
        let id;
        try { id = window.localStorage.getItem("shopify_cart_id"); } catch { /* Use an in-memory cart. */ }
        remember((id ? await fetchCart(id) : null) || await createCart());
      } catch {
        setCartError("Your cart could not be loaded. Please try again.");
      } finally { busy.current = false; setLoading(false); }
    })();
  }, [remember]);

  const refreshCart = useCallback(async () => {
    if (!currentCart.current?.id || busy.current) return currentCart.current;
    try { return remember(await fetchCart(currentCart.current.id)); }
    catch { setCartError("Your cart could not be refreshed. Please try again."); return null; }
  }, [remember]);

  const handleAddToCart = useCallback(async (variantId, quantity = 1) => {
    if (busy.current || checkingOut.current || !variantId || !Number.isInteger(quantity) || quantity < 1) return null;
    busy.current = true; setLoading(true); setCartError("");
    try {
      const before = currentCart.current || remember(await createCart());
      const after = await addItemToCart({cartId: before.id, variantId, quantity});
      remember(after);
      trackCartEvent("add_to_cart", after, addedLines(before, after, variantId));
      return after;
    } catch {
      setCartError("That item could not be added. Please try again.");
      return null;
    } finally { busy.current = false; setLoading(false); }
  }, [remember]);

  const handleRemoveFromCart = useCallback(async item => {
    if (busy.current || checkingOut.current || !currentCart.current?.id) return null;
    busy.current = true; setLoading(true); setCartError("");
    try {
      const before = currentCart.current;
      const line = cartLines(before).find(candidate => candidate.id === item.id);
      if (!line) return null;
      const after = line.quantity > 1
        ? await updateCartItemQuantity(before.id, line.id, line.quantity - 1)
        : await removeItemFromCart(before.id, line.id);
      remember(after);
      trackCartEvent("remove_from_cart", before, addedLines(after, before, line.merchandise.id));
      return after;
    } catch {
      setCartError("Your cart could not be updated. Please try again.");
      return null;
    } finally { busy.current = false; setLoading(false); }
  }, [remember]);

  useEffect(() => {
    const resume = event => {
      if (!event.persisted) return;
      checkingOut.current = false;
      setLoading(false);
      refreshCart();
    };
    window.addEventListener("pageshow", resume);
    return () => window.removeEventListener("pageshow", resume);
  }, [refreshCart]);

  const beginCheckout = useCallback(async freshCart => {
    if (busy.current || checkingOut.current) return false;
    checkingOut.current = true; setLoading(true); setCartError("");
    try {
      const next = freshCart?.id ? freshCart : await refreshCart();
      if (!navigateToCheckout(next, process.env.NEXT_PUBLIC_CHECKOUT_EVENT_OWNER || "storefront")) {
        throw new Error("Checkout unavailable");
      }
      return true;
    } catch {
      checkingOut.current = false; setLoading(false);
      setCartError("Checkout could not be opened. Please check your cart and try again.");
      return false;
    }
  }, [refreshCart]);

  // One view per opening; cart mutations while the drawer is open are not new views.
  const drawerViewed = useRef(false);
  useEffect(() => {
    if (!isCartOpen) { drawerViewed.current = false; return; }
    if (!drawerViewed.current && cartLines(cart).length) {
      drawerViewed.current = true;
      trackCartEvent("view_cart", cart);
    }
  }, [isCartOpen, cart]);

  return <ShopContext.Provider value={{cart, loading, cartError, handleAddToCart,
    handleRemoveFromCart, refreshCart, beginCheckout, isCartOpen, toggleCart, openCart, closeCart}}>
    {children}
    {cartError && <div role="alert" className="fixed bottom-4 left-4 right-4 z-[100] bg-white text-black border border-red-700 p-4 rounded shadow-lg">
      {cartError} <button type="button" onClick={() => setCartError("")} className="underline ml-3">Dismiss</button>
    </div>}
  </ShopContext.Provider>;
};
