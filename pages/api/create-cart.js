// pages/api/create-cart.js
import { createCart } from "@/lib/shopify";

export default async function handler(req, res) {
  try {
    const cart = await createCart();
    res.status(200).json({ cartId: cart.id, items: [], checkoutUrl: cart.checkoutUrl, estimatedCost: null });
  } catch (error) {
    console.error('Error creating new cart:', error);
    res.status(500).json({ error: 'Error creating new cart' });
  }
}
