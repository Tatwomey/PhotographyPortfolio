import { loadCart } from "@/lib/shopify";

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).end('Method Not Allowed');
    }

    const { cartId } = req.body;

    try {
        if (!cartId) {
            throw new Error('No cart ID provided');
        }

        console.log('Fetching cart details for cart ID:', cartId);
        const cart = await loadCart(cartId);

        // Format cart data as needed before sending response
        const formattedCart = {
            id: cart.id,
            lines: cart.lines.edges.map(({ node }) => ({
                id: node.id,
                quantity: node.quantity,
                merchandise: {
                    id: node.id,
                    title: node.merchandise.product.title,
                    slug: node.merchandise.product.handle,
                    price: node.merchandise.price,
                    images: node.merchandise.product.images.edges.map(({ node }) => ({
                        src: node.src,
                        alt: node.altText,
                    })),
                },
            })),
            estimatedCost: cart.estimatedCost,
        };

        res.status(200).json(formattedCart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: error.message });
    }
}
