/* =========================================================
   GET POPUP PRODUCT PATHS
   Used by getStaticPaths()
========================================================= */

export const getPopupProductPaths = async () => {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      {
        collectionByHandle(handle: "popup-shop") {
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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(graphqlQuery),
  });

  const json = await res.json();

  const products = json?.data?.collectionByHandle?.products?.edges || [];

  const paths = products.map(({ node }) => ({
    params: { slug: node.handle },
  }));

  return {
    paths,
    fallback: false,
  };
};

/* =========================================================
   GET POPUP PRODUCT BY HANDLE (MARKET AWARE)
========================================================= */

export const getPopupProductByHandle = async (handle, countryCode = "US") => {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query ProductByHandle($handle: String!, $country: CountryCode!)
      @inContext(country: $country) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description

          images(first: 10) {
            edges {
              node {
                url
                altText
              }
            }
          }

          variants(first: 25) {
            edges {
              node {
                id
                title
                availableForSale
                selectedOptions { name value }

                price {
                  amount
                  currencyCode
                }

                priceV2 {
                  amount
                  currencyCode
                }

                image {
                  url
                }
              }
            }
          }
        }
      }
    `,
    variables: {
      handle,
      country: countryCode,
    },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(graphqlQuery),
  });

  const json = await res.json();
  const node = json?.data?.productByHandle;

  if (!node) return null;

  return {
    ...node,

    /* normalize image shape */
    images: node.images.edges.map(({ node: img }) => ({
      src: img.url,
      altText: img.altText || "",
    })),

    variants: node.variants.edges.map(({ node: v }) => ({
      ...v,
      price: v.price ??
        v.priceV2 ?? {
          amount: "0.00",
          currencyCode: "USD",
        },
      image: v.image?.url || null,
      selectedOptions: v.selectedOptions || [],
    })),
  };
};
