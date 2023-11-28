import fetch from 'node-fetch';

export async function sendShopifyStoreFrontRequest({ query, variables }) {
    const result = await fetch('https://680129-2.myshopify.com/api/2023-10/graphql.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
        },
        body: JSON.stringify({ query, variables }),
    });

    if (!result.ok) {
        console.error('Response Error:', result);
        throw new Error('Shopify storefront request failed');
    }

    const { data } = await result.json();
    return data;
}

export async function createCart() {
    const data = await sendShopifyStoreFrontRequest({
        query: `
            mutation CreateCart {
                cartCreate(input: {}) {
                    cart {
                        id
                        checkoutUrl
                    }
                    userErrors {
                        message
                        field
                    }
                }
            }
        `,
        variables: {}
    });

    if (!data || data.cartCreate.userErrors?.length > 0) {
        console.error('Cart Creation Errors:', data?.cartCreate?.userErrors);
        throw new Error('Error in creating cart');
    }

    return data.cartCreate.cart; // Ensure this aligns with your application's state structure
}
