import { removeItemFromCart } from "@/lib/shopify";

export const removeFromCart = async ({ cartId, lineId }) => {
  try {
    const shopifyResponse = await removeItemFromCart(cartId, lineId);
    return shopifyResponse;
  } catch (error) {
    console.error('Error in removeItemFromCart:', error);
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};
