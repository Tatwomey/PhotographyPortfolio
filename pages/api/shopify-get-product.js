// pages/api/shopify-get-product.js
import { postToShopify } from "@/utils/shopify";

export default async function handler(req, res) {
  // Only allow POST method for this endpoint
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Extract itemHandle from the request body
  const { itemHandle } = req.body;

  try {
    // Check if itemHandle is provided in the request
    if (!itemHandle) {
      return res.status(400).json({ message: 'No item handle provided' });
    }

    console.log('Retrieving product details for handle:', itemHandle);
    const shopifyResponse = await postToShopify({
      query: `
        query getProduct($handle: String!) {
          productByHandle(handle: $handle) {
            id
            handle
            description
            title
            totalInventory
            variants(first: 5) {
              edges {
                node {
                  id
                  title
                  quantityAvailable
                  priceV2 {
                    amount
                    currencyCode
                  }
                }
              }
            }
            priceRange {
              maxVariantPrice {
                amount
                currencyCode
              }
              minVariantPrice {
                amount
                currencyCode
              }
            }
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
      `,
      variables: { handle: itemHandle },
    });

    // Check if the response from Shopify contains the product data
    if (shopifyResponse && shopifyResponse.data && shopifyResponse.data.productByHandle) {
      // Send the product data back in the response
      res.status(200).json(shopifyResponse.data.productByHandle);
    } else {
      // If the product data is not present, send an appropriate error message
      throw new Error('Product not found');
    }
  } catch (error) {
    // Log the error and send a 500 internal server error response
    console.error('Error retrieving product from Shopify:', error);
    res.status(500).json({ error: error.message });
  }
}
