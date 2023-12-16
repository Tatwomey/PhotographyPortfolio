import fetch from 'node-fetch';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN;
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

async function ShopifyData(query, variables) {
  const URL = `https://${domain}/api/2022-10/graphql.json`;

  const options = {
    method: 'POST',
    headers: {
      'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }), // Include variables in the request body
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
  if (!Array.isArray(lineItems)) {
    console.error('lineItems is not an array:', lineItems);
    return { cartId: null, checkoutUrl: null };
  }

  console.log('Creating checkout with line items:', lineItems);

  try {
    const lineItemsQueryPart = lineItems.map(item => {
        return `{ variantId: "${item.variantId}", quantity: ${item.quantity} }`;
    }).join(',');

    const query = `
      mutation {
        checkoutCreate(input: {
          lineItems: [${lineItemsQueryPart}]
        }) {
          checkout {
            id
            webUrl
          }
          userErrors {
            field
            message
          }
        }
      }`;

    const response = await ShopifyData(query);

    console.log('Shopify response for checkoutCreate:', response);

        if (response && response.data && response.data.checkoutCreate && response.data.checkoutCreate.checkout) {
            const checkout = response.data.checkoutCreate.checkout;
            return checkout; // Return the entire checkout object
        } else {
            // Handle the case where checkout is not returned
            console.error('Checkout creation failed:', response);
            return { cartId: null, checkoutUrl: null };
        }
    } catch (error) {
        console.error('Error in createCheckout:', error);
        throw new Error(`Error in createCheckout: ${error.message}`);
    }
}
export async function updateCheckout(id, lineItems) {
  console.log('Updating checkout with ID:', id, 'Line Items:', lineItems); // Add this line for debugging

  // Format the line items as an array of objects
  const lineItemsFormatted = lineItems.map(item => ({
    variantId: item.id,
    quantity: parseInt(item.variantQuantity, 10) // Ensuring quantity is an integer
  }));

  // GraphQL Mutation Query
  const query = `
    mutation checkoutLineItemsReplace($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
      checkoutLineItemsReplace(checkoutId: $checkoutId, lineItems: $lineItems) {
        checkout {
          id
          webUrl
        }
        userErrors {
          field
          message
        }
      }
    }`;

  // Variables for the GraphQL Mutation
  const variables = {
    checkoutId: id,
    lineItems: lineItemsFormatted
  };

  try {
    // Pass the query and variables to the ShopifyData function
    const response = await ShopifyData(query, variables);

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