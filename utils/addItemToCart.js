import { postToShopify } from "./shopify";

export const addItemToCart = async ({ cartId, itemId, quantity }) => {
    try {
        const shopifyResponse = await postToShopify({
            query: `
                mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
                    cartLinesAdd(cartId: $cartId, lines: $lines) {
                        cart {
                            id
                            // Include additional fields if necessary
                        }
                    }
                }
            `,
            variables: {
                cartId,
                lines: [
                    {
                        merchandiseId: itemId,
                        quantity,
                    },
                ],
            },
        });

        return shopifyResponse.cartLinesAdd.cart; // Ensure this aligns with your application's state structure
    } catch (error) {
        console.error('Error in addItemToCart:', error);
        throw error;
    }
};
