import { getProduct } from "@/lib/shopify";

export default async function handler(req, res) {
    // Only allow POST method for this endpoint
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    // Extract itemHandle from the request body
    const { itemHandle } = req.body;

    try {
        // Check if itemHandle is provided in the request
        if (!itemHandle) {
            return res.status(400).json({ message: 'No item handle provided' });
        }

        console.log('Retrieving product details for handle:', itemHandle);
        const product = await getProduct(itemHandle);

        // Send the product data back in the response
        res.status(200).json(product);
    } catch (error) {
        // Log the error and send a 500 internal server error response
        console.error('Error retrieving product:', error);
        res.status(500).json({ error: error.message });
    }
}
