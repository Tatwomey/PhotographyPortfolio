import { removeItemFromCart } from "@/utils/removeItemFromCart";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { cartId, lineId } = req.body;

  try {
    console.log('Removing item from cart...');
    const shopifyResponse = await removeItemFromCart({
      cartId,
      lineId,
    });

    res.status(200).json(shopifyResponse.cartLinesRemove.cart);
  } catch (error) {
    console.error('Error removing item from cart:', error);
    res.status(500).json({ error: error.message });
  }
}
