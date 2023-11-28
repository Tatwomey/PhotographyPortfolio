import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartId, setCartId] = useState(null);

  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    const savedCartData = localStorage.getItem('trevortwomeyphoto:Shopify:cart');
    const savedCartId = savedCartData ? JSON.parse(savedCartData).cartId : null;

    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
    if (savedCartId) {
      setCartId(savedCartId);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify({ cartId }));
  }, [cartItems, cartId]);

  // Function to add an item to the cart
  const addItemToCart = (newItem) => {
    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      if (existingItem) {
        return currentItems.map(item => 
          item.id === newItem.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  };

  // Function to remove an item from the cart
  const removeItemFromCart = (itemId) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== itemId));
  };

  return (
    <CartContext.Provider value={{ cartItems, addItemToCart, removeItemFromCart, cartId, setCartId }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
