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

        if (data.errors) {
            console.error('GraphQL errors:', data.errors);
            throw new Error('Error in GraphQL request');
        }

        return data;
    } catch (error) {
        console.error('Error in sendShopifyStoreFrontRequest:', error);
        throw new Error(`Error creating cart: ${error.message}`);
    }
}

export async function createCheckout(cartItems) {
    const lineItems = cartItems.map(item => ({
        variantId: item.variantId,
        quantity: item.quantity
    }));

    const query = `
        mutation CreateCheckout($lineItems: [CheckoutLineItemInput!]!) {
            checkoutCreate(input: { lineItems: $lineItems }) {
                checkout {
                    id
                    webUrl
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const variables = { lineItems };

    try {
        const response = await sendShopifyStoreFrontRequest({ query, variables });
        const { checkoutCreate } = response.data;

        if (checkoutCreate.userErrors.length > 0) {
            console.error('Checkout creation errors:', checkoutCreate.userErrors);
            throw new Error('Checkout creation failed');
        }

        return checkoutCreate.checkout;
    } catch (error) {
        console.error('Error in createCheckout:', error);
        throw new Error(`Error creating checkout: ${error.message}`);
    }
}
