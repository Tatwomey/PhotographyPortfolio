// utils/load-cart.js
import { shopifyFetch } from '../shopify';

export const loadCart = async (cartId) => {
  const query = `
    query getCart($cartId: ID!) {
      cart(id: $cartId) {
        id
        lines(first: 10) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  priceV2 {
                    amount
                    currencyCode
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          src
                          altText
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
        checkoutUrl
      }
    }
  `;

  const variables = { cartId };

  try {
    const responseJson = await shopifyFetch(query, variables);
    console.log('Response from loadCart:', responseJson);

    if (
      !responseJson.data ||
      !responseJson.data.cart ||
      !responseJson.data.cart.lines ||
      !responseJson.data.cart.lines.edges
    ) {
      throw new Error('Invalid response structure');
    }

    return responseJson.data.cart;
  } catch (error) {
    console.error('Error loading cart:', error);
    throw new Error('Error loading cart');
  }
};
