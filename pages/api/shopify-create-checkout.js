import { createCheckout } from '../../lib/shopify';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { lineItems, buyerInfo } = req.body;

    // Log the received data for debugging
    console.log("Received lineItems:", lineItems);
    console.log("Received buyerInfo:", buyerInfo);

    try {
        const checkoutSession = await createCheckout(lineItems, buyerInfo);
        console.log('Sending back:', { checkoutUrl: checkoutSession.webUrl });
        res.status(200).json({ checkoutUrl: checkoutSession.webUrl });
    } catch (error) {
        console.error('Error in shopify-create-checkout:', error);
        res.status(500).json({ error: error.message });
    }
}
