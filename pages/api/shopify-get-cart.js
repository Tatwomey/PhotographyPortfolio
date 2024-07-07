import { fetchCart } from "@/lib/shopify";

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cartId } = req.query;

  if (!cartId) {
    return res.status(400).json({ message: 'Missing cart ID' });
  }

  try {
    const cart = await fetchCart(cartId);
    return res.status(200).json(cart);
  } catch (error) {
    console.error('Error getting cart:', error);
    return res.status(500).json({ message: 'Error getting cart' });
  }
}
