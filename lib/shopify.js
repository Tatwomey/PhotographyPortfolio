const shopifyFetch = async (query, variables = {}) => {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    if (responseJson.errors) {
      throw new Error(`GraphQL error: ${responseJson.errors.map(e => e.message).join(', ')}`);
    }

    return responseJson;
  } catch (error) {
    console.error('Error in shopifyFetch:', error);
    throw new Error('Error in shopifyFetch');
  }
};

export const createCart = async () => {
  const query = `
    mutation {
      cartCreate {
        cart {
          id
        }
      }
    }
  `;

  const responseJson = await shopifyFetch(query);
  const cart = responseJson.data.cartCreate.cart;
  return cart;
};

export const fetchCart = async (cartId) => {
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
    console.error('Error fetching cart:', error);
    throw new Error('Error fetching cart');
  }
};

export const addItemToCart = async ({ cartId, variantId, quantity }) => {
  const query = `
    mutation addItem($cartId: ID!, $lines: [CartLineInput!]!) {
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
    lines: [{ quantity, merchandiseId: variantId }]
  };

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesAdd.cart;
  return updatedCart;
};

export const removeItemFromCart = async (cartId, lineId) => {
  const query = `
    mutation removeItem($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
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

  const variables = { cartId, lineIds: [lineId] };

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesRemove.cart;
  return updatedCart;
};

export const updateCartItemQuantity = async (cartId, lineId, quantity) => {
  const query = `
    mutation updateItem($cartId: ID!, $lineId: ID!, $quantity: Int!) {
      cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
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

  const variables = { cartId, lineId, quantity };

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesUpdate.cart;
  return updatedCart;
};

export const getProductsInCollection = async (collectionHandle) => {
  const query = `
    query getProducts($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: 10) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
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

  const responseJson = await shopifyFetch(query, variables);
  const products = responseJson.data.collectionByHandle.products.edges.map(edge => edge.node);
  return products;
};

export const getProduct = async (handle) => {
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        images(first: 5) {
          edges {
            node {
              src
              altText
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
  `;

  const variables = { handle };

  const responseJson = await shopifyFetch(query, variables);
  const product = responseJson.data.productByHandle;
  return product;
};

export const createCheckout = async (lineItems) => {
  const query = `
    mutation checkoutCreate($lineItems: [CheckoutLineItemInput!]!) {
      checkoutCreate(input: { lineItems: $lineItems }) {
        checkout {
          id
          webUrl
        }
      }
    }
  `;

  const variables = { lineItems };

  const responseJson = await shopifyFetch(query, variables);
  const checkout = responseJson.data.checkoutCreate.checkout;
  return checkout;
};
