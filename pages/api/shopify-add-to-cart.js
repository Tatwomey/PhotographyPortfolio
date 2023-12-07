import { createCheckout, updateCheckout } from '../../lib/shopify';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { cartId, itemId, quantity } = req.body;

    try {
        let cart;

        if (cartId) {
            const lineItems = [{ id: itemId, variantQuantity: quantity }];
            cart = await updateCheckout(cartId, lineItems);
        } else {
            cart = await createCheckout(itemId, quantity);
        }

        res.status(200).json(cart);
    } catch (error) {
        console.error('Error in shopify-add-to-cart handler:', error);
        res.status(500).json({ message: 'Error processing your request' });
    }
}
