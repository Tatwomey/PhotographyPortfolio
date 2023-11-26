import { sendShopifyStorefrontRequest } from './create-cart.js';

export async function loadCart(cartId) {
  try {
    const data = await sendShopifyStorefrontRequest({
      query: `
        query GetCart($cartId: ID!) {
          cart(id: $cartId) {
            checkoutUrl
            estimatedCost {
              totalAmount {
                amount
              }
            }
            lines(first: 100) {
              edges {
                node {
                  quantity
                  estimatedCost {
                    subtotalAmount {
                      amount
                      currencyCode
                    }
                    totalAmount {
                      amount
                      currencyCode
                    }
                  }
                  merchandise {
                    ... on ProductVariant {
                      title
                      product {
                        title
                      }
                      priceV2 {
                        amount
                        currencyCode
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `,
      variables: { cartId },
    });

    return data.cart;
  } catch (error) {
    console.error('Error loading cart:', error);
    throw error;
  }
}
