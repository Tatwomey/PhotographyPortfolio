import fetch from 'node-fetch';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function ShopifyData(query) {
  const URL = `https://${domain}/api/2022-10/graphql.json`;

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
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
    throw new Error(`Products not fetched: ${error.message}`);
  }
}

export async function createCheckout(id, quantity) {
  try {
    const query = `
      mutation {
        checkoutCreate(input: {
          lineItems: [{ variantId: "${id}", quantity: ${quantity}}]
        }) {
          checkout {
            id
            webUrl
          }
        }
      }`;

    const response = await ShopifyData(query);

    if (response && response.data && response.data.checkoutCreate && response.data.checkoutCreate.checkout) {
      const checkout = response.data.checkoutCreate.checkout;
      return {
        cartId: checkout.id,
        checkoutUrl: checkout.webUrl
      };
    } else {
      console.error('Error creating checkout. Response:', response);
      return { cartId: null, checkoutUrl: null };
    }
  } catch (error) {
    console.error('Error creating checkout:', error);
    return { cartId: null, checkoutUrl: null };
  }
}

export async function updateCheckout(id, lineItems) {
  const lineItemsObject = lineItems.map((item) => {
    return `{
      variantId: "${item.id}",
      quantity:  ${item.variantQuantity}
    }`;
  });

  try {
    const response = await ShopifyData(query);

    if (response.data.checkoutLineItemsReplace && response.data.checkoutLineItemsReplace.checkout) {
      const checkout = response.data.checkoutLineItemsReplace.checkout;
      return {
        cartId: checkout.id,
        checkoutUrl: checkout.webUrl
      };
    } else {
      // Handle errors or log them if necessary
      const userErrors = response.data.checkoutLineItemsReplace.userErrors;
      if (userErrors && userErrors.length > 0) {
        console.error('Error in updateCheckout:', userErrors[0].message);
      }
      return null;
    }
  } catch (error) {
    console.error('Error in updateCheckout:', error);
    throw new Error('Error updating checkout: ' + error.message);
  }
}

export async function removeItemFromCart(cartId, lineId) {
  const query = `
    mutation {
      checkoutLineItemsRemove(checkoutId: "${cartId}", lineItemIds: ["${lineId}"]) {
        checkout {
          id
        }
      }
    }`;

  try {
    const response = await ShopifyData(query);

    if (response.data.checkoutLineItemsRemove && response.data.checkoutLineItemsRemove.checkout) {
      return response.data.checkoutLineItemsRemove.checkout;
    } else {
      throw new Error('Failed to remove item from cart');
    }
  } catch (error) {
    console.error('Error in removeItemFromCart:', error);
    throw new Error('Error removing item from cart: ' + error.message);
  }
}

export async function getCart(cartId) {
  const query = `
    {
      node(id: "${cartId}") {
        ... on Checkout {
          id
          lines(first: 10) {
            edges {
              node {
                id
                quantity
                merchandise {
                  id
                  price
                  product {
                    title
                    handle
                    images(first: 5) {
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
          estimatedCost {
            totalAmount {
              amount
              currencyCode
            }
          }
        }
      }
    }`;

  try {
    const response = await ShopifyData(query);

    if (response.data.node && response.data.node.lines) {
      const cart = response.data.node;
      return cart;
    } else {
      throw new Error('Failed to fetch cart');
    }
  } catch (error) {
    console.error('Error in getCart:', error);
    throw new Error('Error fetching cart: ' + error.message);
  }
}

export async function getAllProducts() {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }`;

  try {
    const response = await ShopifyData(query);

    if (response.data.products && response.data.products.edges) {
      const products = response.data.products.edges.map((edge) => edge.node);
      return products;
    } else {
      throw new Error('Failed to fetch products');
    }
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    throw new Error('Error fetching products: ' + error.message);
  }
}

export async function recursiveCatalog(cursor = '', initialRequest = true) {
  let data;

  if (cursor !== '') {
    const query = `{
      products(after: "${cursor}", first: 250) {
        edges {
          cursor
          node {
            id
            handle
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`;

    try {
      const response = await ShopifyData(query);
      data = response.data.products.edges ? response.data.products.edges : [];

      if (response.data.products.pageInfo.hasNextPage) {
        const num = response.data.products.edges.length;
        const cursor = response.data.products.edges[num - 1].cursor;
        console.log('Cursor: ', cursor);

        return data.concat(await recursiveCatalog(cursor));
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error in recursiveCatalog:', error);
      throw new Error('Error fetching product catalog: ' + error.message);
    }
  } else {
    const query = `{
      products(first: 250) {
        edges {
          cursor
          node {
            id
            handle
          }
        }
        pageInfo {
          hasNextPage
        }
      }
    }`;

    try {
      const response = await ShopifyData(query);
      data = response.data.products.edges ? response.data.products.edges : [];

      if (response.data.products.pageInfo.hasNextPage) {
        const num = response.data.products.edges.length;
        const cursor = response.data.products.edges[num - 1].cursor;

        return data.concat(await recursiveCatalog(cursor));
      } else {
        return data;
      }
    } catch (error) {
      console.error('Error in recursiveCatalog:', error);
      throw new Error('Error fetching product catalog: ' + error.message);
    }
  }
}
