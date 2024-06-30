// utils/load-cart.js
export const loadCart = async (cartId) => {
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

  const response = await shopifyFetch(query, variables);
  return response.cart;
};
