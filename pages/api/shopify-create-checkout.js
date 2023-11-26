// pages/api/shopify-create-checkout.js
import { postToShopify } from "@/utils/shopify"; // Ensure this path is correct

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { lineItems, buyerInfo, metafields } = req.body;

    try {
        // Create a cart with line items
        let cartCreateResponse = await postToShopify({
            query: `
                mutation cartCreate($input: CartInput!) {
                    cartCreate(input: $input) {
                        cart {
                            id
                            checkoutUrl
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
                    lines: lineItems.map(item => ({
                        quantity: item.quantity,
                        merchandiseId: item.variantId,
                    })),
                    buyerIdentity: buyerInfo ? {
                        email: buyerInfo.email,
                        phone: buyerInfo.phone,
                        countryCode: buyerInfo.countryCode,
                    } : undefined,
                    metafields: metafields ? metafields : undefined,
                },
            },
        });

        if (cartCreateResponse.userErrors && cartCreateResponse.userErrors.length > 0) {
            throw new Error(cartCreateResponse.userErrors.map(e => e.message).join(", "));
        }

        const cartId = cartCreateResponse.cartCreate.cart.id;

        // Respond with the checkout URL
        res.status(200).json({ checkoutUrl: cartCreateResponse.cartCreate.cart.checkoutUrl });
    } catch (error) {
        console.error('Error in shopify-create-checkout:', error);
        res.status(500).json({ error: error.message });
    }
}
