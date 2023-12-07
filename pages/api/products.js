import { getProductsInCollection } from '../../lib/shopify';

export default async function handler(_req, res) {
    try {
        const products = await getProductsInCollection();

        res.status(200).json(products);
    } catch (error) {
        console.error('Error in products API:', error);
        res.status(500).json({ error: 'Error fetching products' });
    }
}
