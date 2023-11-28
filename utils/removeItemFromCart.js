import { postToShopify } from "./shopify";

export const removeItemFromCart = async ({ cartId, lineId }) => {
    try {
        const shopifyResponse = await postToShopify({
            query: `
                mutation removeItemFromCart($cartId: ID!, $lineIds: [ID!]!) {
                    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
                        cart {
                            id
                            // Include additional fields if necessary
                        }
                    }
                }
            `,
            variables: {
                cartId,
                lineIds: [lineId],
            },
        });

        return shopifyResponse.cartLinesRemove.cart; // Adjust based on your application's requirements
    } catch (error) {
        console.error('Error in removeItemFromCart:', error);
        throw error;
    }
};
