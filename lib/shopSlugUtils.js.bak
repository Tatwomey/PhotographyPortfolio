export const getShopProductPaths = async () => {
    const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
    
    const graphqlQuery = {
    query: `
    {
    products(first: 100) {
    edges {
    node {
    handle
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
    
    const responseJson = await res.json();
    return responseJson.data.products.edges.map(({ node }) => ({
    params: { slug: node.handle },
    }));
    };
    
    export const getShopProductByHandle = async (handle) => {
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
    selectedOptions { name value }
    priceV2 { amount currencyCode }
    availableForSale
    }
    }
    }
    }
    }`,
    variables: { handle },
    };
    
    const res = await fetch(endpoint, {
    method: "POST",
    headers: {
    "Content-Type": "application/json",
    "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(graphqlQuery),
    });
    
    const responseJson = await res.json();
    const node = responseJson.data.productByHandle;
    return {
    ...node,
    images: node.images.edges.map((e) => e.node),
    variants: node.variants.edges.map((e) => e.node),
    };
    };