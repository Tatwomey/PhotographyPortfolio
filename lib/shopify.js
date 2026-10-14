const shopifyFetch = async (query, variables = {}) => {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const responseJson = await response.json();

    if (responseJson.errors) {
      throw new Error(
        `GraphQL error: ${responseJson.errors.map((e) => e.message).join(", ")}`,
      );
    }


    return responseJson;
  } catch (error) {
    console.error("Error in shopifyFetch:", error);
    throw new Error("Error in shopifyFetch");
  }
};

// One cart shape for every mutation and read; use Shopify's confirmed result.
const CART_FIELDS = `
  id
  checkoutUrl
  cost { subtotalAmount { amount currencyCode } }
  lines(first: 250) {
    pageInfo { hasNextPage }
    edges { node {
      id
      quantity
      cost { totalAmount { amount currencyCode } }
      merchandise { ... on ProductVariant {
        id
        title
        priceV2: price { amount currencyCode }
        product {
          id
          handle
          title
          images(first: 1) { edges { node { src: url altText } } }
        }
      } }
    } }
  }
`;

function confirmedCart(payload) {
  if (payload?.userErrors?.length) {
    throw new Error(payload.userErrors.map(error => error.message).join("; "));
  }
  if (!payload?.cart?.id) throw new Error("Shopify did not return a cart");
  return payload.cart;
}

export const createCart = async () => {
  const response = await shopifyFetch(`mutation createAnalyticsCart {
    cartCreate { cart { ${CART_FIELDS} } userErrors { field message code } }
  }`);
  return confirmedCart(response.data?.cartCreate);
};

export const fetchCart = async (cartId) => {
  const response = await shopifyFetch(`query getCart($cartId: ID!) {
    cart(id: $cartId) { ${CART_FIELDS} }
  }`, { cartId });
  return response.data?.cart || null;
};

export const addItemToCart = async ({ cartId, variantId, quantity }) => {
  const response = await shopifyFetch(`mutation addItem($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { ${CART_FIELDS} } userErrors { field message code }
    }
  }`, { cartId, lines: [{ quantity, merchandiseId: variantId }] });
  return confirmedCart(response.data?.cartLinesAdd);
};

export const removeItemFromCart = async (cartId, lineId) => {
  const response = await shopifyFetch(`mutation removeItem($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { ${CART_FIELDS} } userErrors { field message code }
    }
  }`, { cartId, lineIds: [lineId] });
  return confirmedCart(response.data?.cartLinesRemove);
};

export const updateCartItemQuantity = async (cartId, lineId, quantity) => {
  const response = await shopifyFetch(`mutation updateItem($cartId: ID!, $lineId: ID!, $quantity: Int!) {
    cartLinesUpdate(cartId: $cartId, lines: [{ id: $lineId, quantity: $quantity }]) {
      cart { ${CART_FIELDS} } userErrors { field message code }
    }
  }`, { cartId, lineId, quantity });
  return confirmedCart(response.data?.cartLinesUpdate);
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
  const products = responseJson.data.collectionByHandle.products.edges.map(
    (edge) => edge.node,
  );
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
export { shopifyFetch };
