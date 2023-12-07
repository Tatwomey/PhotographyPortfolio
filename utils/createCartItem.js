// utils/createCartItem.js

export const createCartItem = async ({ itemId, quantity }) => {
    try {
      const response = await fetch(`/api/create-cart-item?itemId=${itemId}&quantity=${quantity}`, {
        method: 'POST',
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const cart = await response.json();
  
      return cart;
    } catch (error) {
      console.error('Error creating cart item:', error);
      throw error;
    }
  };
  
  export default createCartItem;
  