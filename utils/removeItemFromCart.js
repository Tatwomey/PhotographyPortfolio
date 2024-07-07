import { removeItemFromCart } from "@/lib/shopify";

export const removeItemFromCart = async ({ cartId, lineId }) => {
  try {
    const shopifyResponse = await removeFromCart({ cartId, lineId });
    return shopifyResponse;
  } catch (error) {
    console.error('Error in removeItemFromCart:', error);
    throw new Error(`Error removing item from cart: ${error.message}`);
  }
};
