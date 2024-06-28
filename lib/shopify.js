import fetch from 'node-fetch';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function ShopifyData(query, variables) {
  const URL = `https://${domain}/api/2024-04/graphql.json`;

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  };

  try {
    const response = await fetch(URL, options);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('ShopifyData Error:', error);
    throw new Error(`Error in ShopifyData: ${error.message}`);
  }
}

export async function createCheckout(lineItems) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    input: {
      lineItems: lineItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
    },
  };

  const response = await ShopifyData(query, variables);
  const checkout = response.data.checkoutCreate.checkout;

  return {
    cartId: checkout.id,
    checkoutUrl: checkout.webUrl,
  };
}

export async function removeFromCart({ cartId, lineId }) {
  const query = `
    mutation RemoveFromCart($cartId: ID!, $lineId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$lineId]) {
        cart {
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
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineId,
  };

  const response = await ShopifyData(query, variables);

  if (response.errors) {
    console.error('GraphQL errors:', response.errors);
    throw new Error('Error in GraphQL request');
  }

  const { cartLinesRemove } = response.data;
  if (cartLinesRemove.userErrors.length > 0) {
    console.error('Cart removal errors:', cartLinesRemove.userErrors);
    throw new Error('Error removing item from cart');
  }

  return cartLinesRemove.cart;
}
