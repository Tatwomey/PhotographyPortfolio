import { addItemToCart } from '@/lib/shopify';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cartId, variantId, quantity } = req.body;

  try {
    const updatedCart = await addItemToCart({ cartId, variantId, quantity });
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error('Error adding item to cart:', error);
    res.status(500).json({ error: 'Failed to add item to cart' });
  }
}
