import React, { createContext, useContext, useState, useEffect } from 'react';
import { addItemToCart, createCart, loadCart, removeItemFromCart } from '@/lib/shopify';

const ShopContext = createContext();

export const useShopContext = () => useContext(ShopContext);

export const ShopProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const localCartData = JSON.parse(window.localStorage.getItem('trevortwomeyphoto:Shopify:cart'));
    console.log('Retrieved cart data from local storage:', localCartData);
    if (localCartData && localCartData.cartId) {
      handleLoadCart(localCartData.cartId);
    }
  }, []);

  useEffect(() => {
    if (cart && cart.id) {
      window.localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify({ cartId: cart.id }));
      console.log('Stored cart data in local storage:', { cartId: cart.id });
    }
  }, [cart]);

  const handleAddToCart = async ({ variantId, quantity }) => {
    setLoading(true);
    setError(null);
    try {
      let updatedCart;
      if (cart && cart.id) {
        console.log('Adding to existing cart:', cart.id);
        updatedCart = await addItemToCart({ cartId: cart.id, variantId, quantity });
      } else {
        const newCart = await createCart();
        console.log('Created new cart:', newCart.id);
        updatedCart = await addItemToCart({ cartId: newCart.id, variantId, quantity });
      }
      setCart(updatedCart);
      console.log('Cart updated:', updatedCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError('Error adding to cart');
    }
    setLoading(false);
  };

  const handleRemoveFromCart = async (lineId) => {
    setLoading(true);
    setError(null);
    try {
      if (!cart || !cart.id) {
        throw new Error('Cart ID is missing');
      }
      console.log('Removing item from cart:', cart.id);
      const updatedCart = await removeItemFromCart(cart.id, lineId);
      setCart(updatedCart);
      console.log('Cart updated:', updatedCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError('Error removing from cart');
    }
    setLoading(false);
  };

  const handleLoadCart = async (cartId) => {
    setLoading(true);
    setError(null);
    try {
      console.log('Loading cart with ID:', cartId);
      const loadedCart = await loadCart(cartId);
      setCart(loadedCart);
      console.log('Cart loaded:', loadedCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setError('Error loading cart');
    }
    setLoading(false);
  };

  return (
    <ShopContext.Provider value={{ cart, loading, error, handleAddToCart, handleRemoveFromCart, handleLoadCart }}>
      {children}
    </ShopContext.Provider>
  );
};
