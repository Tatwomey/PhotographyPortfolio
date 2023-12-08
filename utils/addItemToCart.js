// utils/addItemToCart.js

export const addItemToCart = async ({ cartId, itemId, quantity }) => {
    try {
      const response = await fetch(`/api/shopify-add-to-cart?cartId=${cartId}&itemId=${itemId}&quantity=${quantity}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const cart = await response.json();
  
      return cart;
    } catch (error) {
      console.error('Error in addItemToCart:', error);
      throw error;
    }
  };
  