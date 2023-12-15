import { createCheckout, updateCheckout } from '../../lib/shopify';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cartId, variantId, quantity } = req.body;

    // Validate variantId
    if (!variantId) {
        console.error("Variant ID is undefined");
        return res.status(400).json({ message: 'Variant ID is undefined' });
    }

    try {
        let cart;

        if (cartId) {
            const lineItems = [{ id: variantId, variantQuantity: quantity }];
            cart = await updateCheckout(cartId, lineItems);
        } else {
            // Change here: Pass as an array
            cart = await createCheckout([{ variantId: variantId, quantity: quantity }]);
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in shopify-add-to-cart handler:', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
}
