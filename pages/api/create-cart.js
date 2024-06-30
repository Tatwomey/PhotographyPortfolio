// pages/api/create-cart.js
import { shopifyFetch } from '../../lib/shopify';

export default async function handler(req, res) {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;

  try {
    const response = await shopifyFetch(query);
    console.log('Response from Shopify:', response);
    const cart = response.data.cartCreate.cart;

    res.status(200).json({ cartId: cart.id, items: [], checkoutUrl: cart.checkoutUrl, estimatedCost: null });
  } catch (error) {
    console.error('Error creating new cart:', error);
    res.status(500).json({ error: 'Error creating new cart' });
  }
}
