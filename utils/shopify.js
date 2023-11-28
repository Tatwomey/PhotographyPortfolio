// shopify.js
export const postToShopify = async ({ query, variables }) => {
    const endpoint = `https://${process.env.SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const headers = {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        // Ensure you have the correct token and headers set up
    };

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error in postToShopify:', error);
        throw error;
    }
};
