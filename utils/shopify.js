import { default as fetch } from 'node-fetch';

export const postToShopify = async ({ query, variables = {} }) => {
    try {
        console.log('API Endpoint:', process.env.SHOPIFY_API_ENDPOINT);
        console.log('Access Token:', process.env.SHOPIFY_STOREFONT_API_TOKEN);

        const response = await fetch(process.env.SHOPIFY_API_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFONT_API_TOKEN,
            },
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
    }
};