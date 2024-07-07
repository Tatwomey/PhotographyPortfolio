import { createCheckout, addItemToCart, createCart } from "@/lib/shopify";

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
    let cart;

    if (!cartId) {
      // If no cart ID, create a new cart and add item to it
      cart = await createCart();
      await addItemToCart({ cartId: cart.cartId, variantId, quantity });
    } else {
      // Add item to the existing cart
      cart = await addItemToCart({ cartId, variantId, quantity });
    }

    // Send the cartId back to the client to store it
    return res.status(200).json({ cartId: cart.cartId, checkoutUrl: cart.checkoutUrl });
  } catch (error) {
    console.error('Error adding to cart:', error);
    return res.status(500).json({ message: 'Error adding to cart' });
  }
}
