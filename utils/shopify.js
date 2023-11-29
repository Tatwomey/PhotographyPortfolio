import { default as fetch } from 'node-fetch';

export const postToShopify = async ({ query, variables = {} }) => {
    try {
        const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
        const headers = {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ query, variables }),
        });

        if (response.status === 404) {
            throw new Error('Resource not found');
        }

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (result.errors) {
            console.error('Shopify API errors:', result.errors);
            throw new Error('Error returned from Shopify API');
        }

        if (!result || !result.data) {
            throw new Error('No results found from Shopify API');
        }

        return result.data;
    } catch (error) {
        console.error('Error in postToShopify:', error);
        throw error;
        const result = await response.json();
if (result.errors) {
    console.error('Shopify API errors:', result.errors);
    throw new Error('Error returned from Shopify API');
}
    }
};
