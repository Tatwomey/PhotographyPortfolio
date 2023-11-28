// pages/api/shopify-add-to-cart.js
import { postToShopify } from '../../utils/shopify';

async function createCartWithItem(itemId, quantity) {
    // Implementation to create a new cart with an item
    try {
        const response = await postToShopify({
            query: `
                mutation cartCreate($input: CartInput!) {
                    cartCreate(input: $input) {
                        cart {
                            id
                            lines(first: 10) {
                                edges {
                                    node {
                                        id
                                        merchandise {
                                            ... on ProductVariant {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                input: {
                    lines: [{ quantity: quantity, merchandiseId: itemId }],
                },
            },
        });

        return response.cartCreate.cart;
    } catch (error) {
        console.error('Error creating cart with item:', error);
        throw error;
    }
}

async function addItemToCart(cartId, itemId, quantity) {
    // Implementation to add an item to an existing cart
    try {
        const response = await postToShopify({
            query: `
                mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
                    cartLinesAdd(cartId: $cartId, lines: $lines) {
                        cart {
                            id
                            lines(first: 10) {
                                edges {
                                    node {
                                        id
                                        merchandise {
                                            ... on ProductVariant {
                                                id
                                                title
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            `,
            variables: {
                cartId: cartId,
                lines: [{ quantity: quantity, merchandiseId: itemId }],
            },
        });

        return response.cartLinesAdd.cart;
    } catch (error) {
        console.error('Error adding item to cart:', error);
        throw error;
    }
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cartId, itemId, quantity } = req.body;

    try {
        let cart;

        if (cartId) {
            cart = await addItemToCart(cartId, itemId, quantity);
        } else {
            cart = await createCartWithItem(itemId, quantity);
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in shopify-add-to-cart handler:', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
}
