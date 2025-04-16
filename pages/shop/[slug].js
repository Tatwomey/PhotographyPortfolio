// pages/shop/[slug].js

import ProductSlugLayout from '@/components/ProductSlugLayout';

export async function getStaticPaths() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      {
        collectionByHandle(handle: "shop") {
          products(first: 100) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    `,
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const responseJson = await res.json();
    const paths = responseJson.data.collectionByHandle.products.edges.map(({ node }) => ({
      params: { slug: node.handle },
    }));

    return { paths, fallback: 'blocking' };
  } catch (err) {
    console.error('Error fetching static paths:', err);
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  const RESERVED_SLUGS = ['terms', 'privacy'];

  if (RESERVED_SLUGS.includes(params.slug)) {
    return { notFound: true };
  }

  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          images(first: 10) {
            edges {
              node {
                src
                altText
              }
            }
          }
          variants(first: 25) {
            edges {
              node {
                id
                title
                image { src }
                selectedOptions {
                  name
                  value
                }
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
    `,
    variables: { handle: params.slug },
  };

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const responseJson = await res.json();

    // ✅ Exit early if product not found
    if (!responseJson?.data?.productByHandle) {
      return { notFound: true };
    }

    const node = responseJson.data.productByHandle;

    const product = {
      ...node,
      images: node.images.edges.map((e) => e.node),
      variants: node.variants.edges.map((e) => e.node),
    };

    return { props: { product } };
  } catch (error) {
    console.error('Error in getStaticProps for slug:', error);
    return { notFound: true };
  }
}


export default function ShopSlug({ product }) {
  return <ProductSlugLayout product={product} />;
}
