import { postToShopify } from "@/utils/shopify";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { cartId } = req.body;

  try {
    if (!cartId) {
      throw new Error('No cart ID provided');
    }

    const shopifyResponse = await postToShopify({
      query: `
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
                      price {
                        amount
                        currencyCode
                      }
                      product {
                        title
                        handle
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
            estimatedCost {
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
        }
      `,
      variables: { cartId },
    });

    if (!shopifyResponse.cart) {
      throw new Error('No valid cart returned from Shopify');
    }

    // Format cart data as needed before sending response
    const formattedCart = {
      ...shopifyResponse.cart,
      lines: shopifyResponse.cart.lines.edges.map(({ node }) => ({
        id: node.id,
        quantity: node.quantity,
        merchandise: {
          id: node.id,
          title: node.merchandise.product.title,
          slug: node.merchandise.product.handle,
          price: node.merchandise.price,
          images: node.merchandise.product.images.edges.map(({ node }) => ({
            src: node.src,
            alt: node.altText,
          })),
        },
      })),
    };

    res.status(200).json(formattedCart);
  } catch (error) {
    console.error('Error fetching cart from Shopify:', error);
    res.status(500).json({ error: error.message });
  }
}
