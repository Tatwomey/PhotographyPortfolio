export async function getStaticProps() {
    const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    if (!endpoint || !token) {
        console.error('Shopify endpoint or token is undefined.');
        return { props: { products: [] } };
    }

    const graphqlQuery = {
        query: `
            query getProductList {
                products(sortKey: PRICE, first: 10, reverse: true) {
                    edges {
                        node {
                            id
                            title
                            handle
                            description
                            images(first: 1) {
                                edges {
                                    node {
                                        src
                                        altText
                                    }
                                }
                            }
                            priceRange {
                                minVariantPrice {
                                    amount
                                    currencyCode
                                }
                            }
                        }
                    }
                }
            }
        `,
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify(graphqlQuery),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseJson = await response.json();

        if (!responseJson || !responseJson.data || !responseJson.data.products || !responseJson.data.products.edges) {
            throw new Error('Products data is not available in the response');
        }

        const products = responseJson.data.products.edges.map(edge => ({
            id: edge.node.id,
            title: edge.node.title,
            handle: edge.node.handle,
            description: edge.node.description,
            imageSrc: edge.node.images.edges[0]?.node.src || '/fallback-image.jpg',
            imageAlt: edge.node.images.edges[0]?.node.altText || 'Product Image',
            price: edge.node.priceRange.minVariantPrice.amount,
        }));

        return { props: { products } };
    } catch (error) {
        console.error('Error fetching products:', error);
        return { props: { products: [] } };
    }
}
