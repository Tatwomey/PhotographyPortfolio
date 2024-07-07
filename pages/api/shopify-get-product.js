import { getProduct } from "@/lib/shopify";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { itemHandle } = req.body;

  try {
    if (!itemHandle) {
      return res.status(400).json({ message: 'No item handle provided' });
    }

    console.log('Retrieving product details for handle:', itemHandle);
    const product = await getProduct(itemHandle);

    res.status(200).json(product);
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ error: error.message });
  }
}
