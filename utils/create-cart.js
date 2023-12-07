import fetch from 'node-fetch';

export async function sendShopifyStoreFrontRequest({ query, variables }) {
    try {
        const data = await fetch('https://680129-2.myshopify.com/api/2023-10/graphql.json', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify({ query, variables }),
        }).then((result) => {
            if (!result.ok) {
                throw new Error(`HTTP error! Status: ${result.status}`);
            }
            return result.json();
        });

        if (!data || data.cartCreate.userErrors?.length > 0) {
            console.error('Cart Creation Errors:', data?.cartCreate?.userErrors);
            throw new Error('Error in creating cart');
        }

        return data.cartCreate.cart;
    } catch (error) {
        console.error('Error in sendShopifyStoreFrontRequest:', error);
        throw new Error(`Error creating cart: ${error.message}`);
    }
}

export async function createCart() {
    const query = `
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
    `;

    const variables = {};

    try {
        const data = await sendShopifyStoreFrontRequest({ query, variables });

        if (!data || data.cartCreate.userErrors?.length > 0) {
            console.error('Cart Creation Errors:', data?.cartCreate?.userErrors);
            throw new Error('Error in creating cart');
        }

        return data.cartCreate.cart;
    } catch (error) {
        console.error('Error in createCart:', error);
        throw new Error(`Error creating cart: ${error.message}`);
    }
}
