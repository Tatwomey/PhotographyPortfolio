import { createCheckout, updateCheckout } from "@/lib/shopify";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { cartId, variantId, quantity } = req.body;

  // Validate variantId and quantity
  if (!variantId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    let checkout;
    if (!cartId) {
      checkout = await createCheckout([{ variantId, quantity }]);
    } else {
      checkout = await updateCheckout(cartId, [{ variantId, quantity }]);
    }

    // Store the cartId for persistence
    if (checkout.id) {
      localStorage.setItem('cartId', checkout.id);
    }

    return res.status(200).json(checkout);
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Error adding to cart' });
  }
}
