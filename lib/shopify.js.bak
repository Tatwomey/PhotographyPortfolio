const shopifyFetch = async (query, variables = {}) => {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  console.log("Shopify Fetch - Endpoint:", endpoint);
  console.log("Shopify Fetch - Token:", token ? "Token is set" : "Token is not set");

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

    console.log("Shopify Fetch - Response JSON:", responseJson);

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

  console.log("Creating a new cart with query:", query);

  const responseJson = await shopifyFetch(query);
  const cart = responseJson.data.cartCreate.cart;
  console.log("Created new cart:", cart);
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

  console.log("Fetching cart with ID:", cartId, "and query:", query);

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

    console.log("Fetched cart data:", responseJson.data.cart);

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

  console.log("Adding item to cart with variables:", variables);

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesAdd.cart;
  console.log("Updated cart after adding item:", updatedCart);
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

  console.log("Removing item from cart with variables:", variables);

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesRemove.cart;
  console.log("Updated cart after removing item:", updatedCart);
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

  console.log("Updating cart item quantity with variables:", variables);

  const responseJson = await shopifyFetch(query, variables);
  const updatedCart = responseJson.data.cartLinesUpdate.cart;
  console.log("Updated cart after updating item quantity:", updatedCart);
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

  console.log("Getting products in collection with handle:", collectionHandle);

  const responseJson = await shopifyFetch(query, variables);
  const products = responseJson.data.collectionByHandle.products.edges.map(edge => edge.node);
  console.log("Fetched products in collection:", products);
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

  console.log("Getting product with handle:", handle);

  const responseJson = await shopifyFetch(query, variables);
  const product = responseJson.data.productByHandle;
  console.log("Fetched product:", product);
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

  console.log("Creating checkout with line items:", lineItems);

  const responseJson = await shopifyFetch(query, variables);
  const checkout = responseJson.data.checkoutCreate.checkout;
  console.log("Created checkout:", checkout);
  return checkout;
};
