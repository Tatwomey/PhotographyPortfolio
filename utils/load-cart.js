import { sendShopifyStorefrontRequest } from './create-cart.js';

export async function loadCart(cartId) {
  try {
    const data = await sendShopifyStorefrontRequest({
     
      variables: { cartId },
    });

    return data.cart;
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
}
