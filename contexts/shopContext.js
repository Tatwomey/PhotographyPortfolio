import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, fetchCart, removeItemFromCart, addItemToCart } from '@/lib/shopify';

const ShopContext = createContext();

export function useShopContext() {
  return useContext(ShopContext);
}

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(null);

  const refreshCart = async () => {
    try {
      const cartId = window.localStorage.getItem('shopify_cart_id');
      let cartData;
      if (!cartId) {
        cartData = await createCart();
        window.localStorage.setItem('shopify_cart_id', cartData.id);
      } else {
        cartData = await fetchCart(cartId);
      }
      if (!cartData || !cartData.id) {
        throw new Error('Invalid cart data');
      }
      setCart(cartData);
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  };

  const handleAddToCart = async (variantId, quantity) => {
    try {
      const cartId = window.localStorage.getItem('shopify_cart_id');
      if (!cartId) {
        const newCart = await createCart();
        window.localStorage.setItem('shopify_cart_id', newCart.id);
        await addItemToCart({ cartId: newCart.id, variantId, quantity });
        await refreshCart();
      } else {
        await addItemToCart({ cartId, variantId, quantity });
        await refreshCart();
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleRemoveFromCart = async (itemId) => {
    try {
      const cartId = window.localStorage.getItem('shopify_cart_id');
      if (!cartId) throw new Error("Cart ID not found in localStorage");
      await removeItemFromCart(cartId, itemId);
      await refreshCart();
    } catch (error) {
      console.error("Failed to remove item from cart:", error);
    }
  };

  useEffect(() => {
    refreshCart();
  }, []);

  return (
    <ShopContext.Provider value={{ cart, handleAddToCart, handleRemoveFromCart, refreshCart }}>
      {children}
    </ShopContext.Provider>
  );
}
