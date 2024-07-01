// shopify.js
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

export async function addItemToCart({ cartId, variantId, quantity }) {
  const graphqlQuery = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
                quantity
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

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);
    return responseJson.data.cartLinesAdd.cart;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    throw new Error('Error adding item to cart');
  }
}

export async function removeItemFromCart(cartId, lineId) {
  const graphqlQuery = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          lines(first: 10) {
            edges {
              node {
                id
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    priceV2 {
                      amount
                      currencyCode
                    }
                  }
                }
                quantity
              }
            }
          }
        }
      }
    }
  `;

  const variables = {
    cartId,
    lineIds: [lineId],
  };

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);
    return responseJson.data.cartLinesRemove.cart;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    throw new Error('Error removing item from cart');
  }
}

export async function loadCart(cartId) {
  const graphqlQuery = `
    query cartQuery($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
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

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);
    return responseJson.data.cart;
  } catch (error) {
    console.error('Error loading cart:', error);
    throw new Error('Error loading cart');
  }
}

export async function createCheckout(items) {
  const lineItems = items.map(item => ({
    variantId: item.variantId,
    quantity: item.quantity,
  }));

  const graphqlQuery = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }`;

  const variables = {
    input: {
      lineItems
    }
  };

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);

    const checkout = responseJson.data.checkoutCreate.checkout;
    return { checkoutUrl: checkout.webUrl, checkoutId: checkout.id };
  } catch (error) {
    console.error('Error creating checkout:', error);
    throw new Error('Error creating checkout');
  }
}

export async function createCart() {
  const graphqlQuery = `
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
    const responseJson = await shopifyFetch(graphqlQuery);
    const cart = responseJson.data.cartCreate.cart;
    return { cartId: cart.id, checkoutUrl: cart.checkoutUrl };
  } catch (error) {
    console.error('Error creating cart:', error);
    throw new Error('Error creating cart');
  }
}

export async function getProductsInCollection(collectionHandle) {
  const graphqlQuery = `
    query getProductsInCollection($handle: String!) {
      collectionByHandle(handle: $handle) {
        title
        products(first: 25) {
          edges {
            node {
              id
              title
              handle
              priceRange {
                minVariantPrice {
                  amount
                }
              }
              images(first: 1) {
                edges {
                  node {
                    originalSrc
                    altText
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
    handle: collectionHandle
  };

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);
    return responseJson.data.collectionByHandle.products.edges;
  } catch (error) {
    console.error('Error fetching products in collection:', error);
    throw new Error('Error fetching products in collection');
  }
}

export async function getProduct(handle) {
  const graphqlQuery = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        description
        handle
        priceRange {
          minVariantPrice {
            amount
          }
        }
        images(first: 5) {
          edges {
            node {
              originalSrc
              altText
            }
          }
        }
        variants(first: 5) {
          edges {
            node {
              id
              title
              priceV2 {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    }
  `;

  const variables = {
    handle
  };

  try {
    const responseJson = await shopifyFetch(graphqlQuery, variables);
    return responseJson.data.productByHandle;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw new Error('Error fetching product');
  }
}
