// utils/addItemToCart.js

export const addItemToCart = async ({ cartId, variantId, quantity }) => {
  try {
      const response = await fetch(`/api/shopify-add-to-cart`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ cartId, itemId: variantId, quantity }),
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

  