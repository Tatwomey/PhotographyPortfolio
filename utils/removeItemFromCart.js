import { removeItemFromCart as removeFromCartShopify } from "../lib/shopify";

export const removeItemFromCart = async ({ cartId, lineId }) => {
    try {
        const shopifyResponse = await removeFromCartShopify({
            cartId,
            lineId,
        });

        return shopifyResponse.cartLinesRemove.cart; // Adjust based on your application's requirements
    } catch (error) {
        console.error('Error in removeItemFromCart:', error);
        throw error;
    }
};
