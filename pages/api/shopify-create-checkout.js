import { createCheckout } from '../../lib/shopify';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { lineItems, buyerInfo, metafields } = req.body;

    try {
        const checkout = await createCheckout(lineItems[0].variantId, lineItems[0].quantity);

        res.status(200).json({ checkoutUrl: checkout.webUrl });
    } catch (error) {
        console.error('Error in shopify-create-checkout:', error);
        res.status(500).json({ error: error.message });
    }
}
