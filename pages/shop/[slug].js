import ProductSlugLayout from "@/components/ProductSlugLayout";

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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const responseText = await res.text();
    let responseJson;

    try {
      responseJson = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ Failed to parse Shopify JSON response:", responseText);
      return { paths: [], fallback: "blocking" };
    }

    const productEdges =
      responseJson?.data?.collectionByHandle?.products?.edges;

    if (!Array.isArray(productEdges)) {
      console.error("❌ Unexpected Shopify structure:", responseJson);
      return { paths: [], fallback: "blocking" };
    }

    const paths = productEdges.map(({ node }) => ({
      params: { slug: node.handle },
    }));

    return { paths, fallback: "blocking" };
  } catch (err) {
    console.error("❌ Error fetching static paths:", err);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const RESERVED_SLUGS = ["terms", "privacy"];
  if (RESERVED_SLUGS.includes(params.slug)) return { notFound: true };

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
                quantityAvailable
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
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    const responseJson = await res.json();
    const node = responseJson?.data?.productByHandle;

    if (!node) return { notFound: true };

    const product = {
      ...node,
      images: node.images.edges.map((e) => e.node),
      variants: node.variants.edges.map((e) => e.node),
    };

    return { props: { product } };
  } catch (error) {
    console.error("❌ Error in getStaticProps for slug:", error);
    return { notFound: true };
  }
}

export default function ShopSlug({ product }) {
  return (
    <ProductSlugLayout
      product={product}
      storeSection="shop"
      breadcrumbLabel="Shop"
      breadcrumbHref="/shop"
      backHref="/shop"
      backLabel="Back to Shop"
    />
  );
}
