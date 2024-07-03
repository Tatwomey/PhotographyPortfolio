export async function shopifyFetch(query, variables = {}) {
  const endpoint = process.env.SHOPIFY_API_ENDPOINT;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    const responseText = await res.text();
    const responseJson = JSON.parse(responseText);

    if (responseJson.errors) {
      throw new Error(responseJson.errors[0].message);
    }

    return responseJson;
  } catch (error) {
    console.error('Error fetching from Shopify:', error);
    throw new Error('Error fetching from Shopify');
  }
}

export async function createCart() {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
        }
      }
    }
  `;
  const response = await shopifyFetch(query);
  console.log('Response from createCart:', response);
  if (!response.data || !response.data.cartCreate || !response.data.cartCreate.cart || !response.data.cartCreate.cart.id) {
    throw new Error('Invalid response from createCart');
  }
  return response.data.cartCreate.cart;
}

export async function addItemToCart({ cartId, variantId, quantity }) {
  console.log('Adding item to cart with ID:', cartId);
  const query = `
    mutation addItemToCart($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
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
        }
      }
    }
  `;
  const variables = {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }]
  };
  const response = await shopifyFetch(query, variables);
  console.log('Response from addItemToCart:', response);
  if (!response.data || !response.data.cartLinesAdd || !response.data.cartLinesAdd.cart) {
    throw new Error('Invalid response from addItemToCart');
  }
  return response.data.cartLinesAdd.cart;
}

export async function removeItemFromCart(cartId, lineId) {
  console.log('Removing item from cart with ID:', cartId);
  const query = `
    mutation removeItemFromCart($cartId: ID!, $lineId: ID!) {
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
        }
      }
    }
  `;
  const variables = { cartId, lineId };
  const response = await shopifyFetch(query, variables);
  console.log('Response from removeItemFromCart:', response);
  if (!response.data || !response.data.cartLinesRemove || !response.data.cartLinesRemove.cart) {
    throw new Error('Invalid response from removeItemFromCart');
  }
  return response.data.cartLinesRemove.cart;
}

export async function loadCart(cartId) {
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
}
