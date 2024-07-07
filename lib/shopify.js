const SHOPIFY_STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const SHOPIFY_STOREFRONT_ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function shopifyFetch(query, variables = {}) {
  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/2021-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const json = await response.json();
    if (json.errors) {
      throw new Error(`Shopify API errors: ${JSON.stringify(json.errors)}`);
    }

    return json;
  } catch (error) {
    console.error("Failed to fetch from Shopify:", error);
    throw error;
  }
}

export async function createCart() {
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
  const response = await shopifyFetch(query);
  if (!response.data || !response.data.cartCreate || !response.data.cartCreate.cart) {
    throw new Error('Invalid response structure from createCart');
  }
  return response.data.cartCreate.cart;
}

export async function fetchCart(cartId) {
  const query = `
    query($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        estimatedCost {
          totalAmount {
            amount
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  priceV2 {
                    amount
                  }
                  product {
                    title
                    images(first: 1) {
                      edges {
                        node {
                          url
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
  const variables = { cartId };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.cart) {
    throw new Error('Invalid response structure from fetchCart');
  }
  return response.data.cart;
}

export async function removeItemFromCart(cartId, itemId) {
  const query = `
    mutation($cartId: ID!, $itemId: ID!) {
      cartLinesRemove(cartId: $cartId, lineIds: [$itemId]) {
        cart {
          id
          checkoutUrl
        }
      }
    }
  `;
  const variables = { cartId, itemId };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.cartLinesRemove || !response.data.cartLinesRemove.cart) {
    throw new Error('Invalid response structure from removeItemFromCart');
  }
  return response.data.cartLinesRemove.cart;
}

export async function addItemToCart({ cartId, variantId, quantity }) {
  const query = `
    mutation($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    priceV2 {
                      amount
                    }
                    product {
                      title
                      images(first: 1) {
                        edges {
                          node {
                            url
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
    lines: [{ merchandiseId: variantId, quantity }],
  };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.cartLinesAdd || !response.data.cartLinesAdd.cart) {
    throw new Error('Invalid response structure from addItemToCart');
  }
  return response.data.cartLinesAdd.cart;
}

export async function createCheckout(lineItems, buyerInfo) {
  const query = `
    mutation($lineItems: [CheckoutLineItemInput!]!, $buyerInfo: MailingAddressInput!) {
      checkoutCreate(input: {
        lineItems: $lineItems
        shippingAddress: $buyerInfo
      }) {
        checkout {
          webUrl
        }
      }
    }
  `;
  const variables = {
    lineItems,
    buyerInfo,
  };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.checkoutCreate || !response.data.checkoutCreate.checkout) {
    throw new Error('Invalid response structure from createCheckout');
  }
  return response.data.checkoutCreate.checkout;
}

export async function getProduct(handle) {
  const query = `
    query($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        variants(first: 1) {
          edges {
            node {
              id
              priceV2 {
                amount
                currencyCode
              }
            }
          }
        }
        images(first: 1) {
          edges {
            node {
              url
            }
          }
        }
      }
    }
  `;
  const variables = { handle };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.productByHandle) {
    throw new Error('Invalid response structure from getProduct');
  }
  return response.data.productByHandle;
}

export async function getProductsInCollection(collectionHandle) {
  const query = `
    query($handle: String!) {
      collectionByHandle(handle: $handle) {
        products(first: 100) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    url
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
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
    }
  `;
  const variables = { handle: collectionHandle };
  const response = await shopifyFetch(query, variables);
  if (!response.data || !response.data.collectionByHandle || !response.data.collectionByHandle.products) {
    throw new Error('Invalid response structure from getProductsInCollection');
  }
  return response.data.collectionByHandle.products.edges.map(edge => edge.node);
}
