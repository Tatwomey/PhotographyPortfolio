import { postToShopify } from "./shopify"; // Correctly point to the shopify utility file

// Creates a cart with a single item and returns the cart data with additional details
export const createCartItem = async ({ itemId, quantity }) => {
  try {
    const response = await postToShopify({
      query: `
        mutation CartCreate($input: CartInput!) {
          cartCreate(input: $input) {
            cart {
              id
              createdAt
              updatedAt
              checkoutUrl
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
                        product {
                          id
                          title
                        }
                      }
                    }
                  }
                }
              }
              attributes {
                key
                value
              }
              cost {
                totalAmount {
                  amount
                  currencyCode
                }
                subtotalAmount {
                  amount
                  currencyCode
                }
                totalTaxAmount {
                  amount
                  currencyCode
                }
                totalDutyAmount {
                  amount
                  currencyCode
                }
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: {
          lines: [{
            quantity: quantity,
            merchandiseId: `gid://shopify/ProductVariant/${itemId}`,
          }],
        },
      },
    });

    // Check for user errors
    if (response.cartCreate.userErrors && response.cartCreate.userErrors.length > 0) {
      throw new Error(response.cartCreate.userErrors.map(e => e.message).join(", "));
    }

    // Return the cart data with additional details
    if (!response || !response.cartCreate || !response.cartCreate.cart) {
      throw new Error('Error in creating cart');
    }
    return response.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart item:', error);
    throw error;
  }
};
