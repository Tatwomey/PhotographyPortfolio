import { removeItemFromCart } from "@/lib/shopify";

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { cartId, lineId } = req.body;

    try {
      const updatedCart = await removeItemFromCart(cartId, lineId);
      res.status(200).json(updatedCart);
    } catch (error) {
      console.error('Error removing item from cart:', error);
      res.status(500).json({ error: 'Failed to remove item from cart' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
