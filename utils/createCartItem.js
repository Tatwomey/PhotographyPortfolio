import { postToShopify } from "./shopify";

export const createCartItem = async ({ itemId, quantity }) => {
    // Convert itemId to Shopify's global ID format
    const merchandiseId = `gid://shopify/ProductVariant/${itemId}`;

    try {
        const response = await postToShopify({
            query: `
                mutation CartCreate($input: CartInput!) {
                    cartCreate(input: $input) {
                        cart {
                            id
                            createdAt
                            updatedAt
                            checkoutUrl
                            lines(first: 10) {
                                edges {
                                    node {
                                        id
                                        merchandise {
                                            ... on ProductVariant {
                                                id
                                                title
                                                priceV2 {
                                                    amount
                                                    currencyCode
                                                }
                                                product {
                                                    id
                                                    title
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            attributes {
                                key
                                value
                            }
                            cost {
                                totalAmount {
                                    amount
                                    currencyCode
                                }
                                subtotalAmount {
                                    amount
                                    currencyCode
                                }
                                totalTaxAmount {
                                    amount
                                    currencyCode
                                }
                                totalDutyAmount {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `,
            variables: {
                input: {
                    lines: [{
                        quantity: quantity,
                        merchandiseId: merchandiseId
                    }],
                },
            },
        });

        if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
            throw new Error(response.cartCreate.userErrors.map(e => e.message).join(", "));
        }

        if (!response || !response.cartCreate || !response.cartCreate.cart) {
            throw new Error('Error in creating cart');
        }

        return response.cartCreate.cart;
    } catch (error) {
        console.error('Error creating cart item:', error);
        throw error;
    }
};

export default createCartItem;
