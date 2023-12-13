// utils/createCartItem.js

export const createCartItem = async ({ variantId, quantity }) => {
    try {
      const response = await fetch(`/api/create-cart-item?variantId=${variantId}&quantity=${quantity}`, {
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
  