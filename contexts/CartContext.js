import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    // Load cart items and cart ID from cookies
    const savedCartItems = JSON.parse(Cookies.get('cartItems') || '[]');
    const savedCartId = Cookies.get('cartId');
    setCartItems(savedCartItems);
    setCartId(savedCartId);
  }, []);

  useEffect(() => {
    // Save cart items and cart ID to cookies
    Cookies.set('cartItems', JSON.stringify(cartItems));
    if (cartId) {
      Cookies.set('cartId', cartId);
    }
  }, [cartItems, cartId]);

  const addItemToCart = (newItem) => {
    setCartItems(currentItems => {
      const itemExists = currentItems.find(item => item.id === newItem.id);
      const updatedItems = itemExists
        ? currentItems.map((item) =>
            item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        : [...currentItems, { ...newItem, quantity: 1 }];

      // Save to cookies right after updating state
      Cookies.set('cartItems', JSON.stringify(updatedItems));

      return updatedItems;
    });
  };

  const removeItemFromCart = (itemId) => {
    setCartItems(currentItems => {
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      
      // Save to cookies right after updating state
      Cookies.set('cartItems', JSON.stringify(updatedItems));
      
      return updatedItems;
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, cartId, setCartId }}>
      {children}
    </CartContext.Provider>
  );
};
