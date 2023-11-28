// pages/shop/[slug].js
import React, { useEffect, useState, useContext } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { CartContext } from '@/contexts/CartContext';

export async function getStaticPaths() {
    const endpoint = `https://${process.env.SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const token = process.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify(graphqlQuery),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const responseJson = await res.json();
        const paths = responseJson.data.products.edges.map(edge => ({
            params: { slug: edge.node.handle },
        }));

        return { paths, fallback: 'blocking' };
    } catch (error) {
        console.error('Failed to fetch product paths:', error);
        return { paths: [], fallback: 'blocking' };
    }
}

export async function getStaticProps({ params }) {
    const endpoint = `https://${process.env.SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;

    const graphqlQuery = {
        query: `
            query ProductByHandle($handle: String!) {
                productByHandle(handle: $handle) {
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
            }`,
        variables: { handle: params.slug },
    };

    try {
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN,
            },
            body: JSON.stringify(graphqlQuery),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const responseJson = await res.json();
        if (!responseJson || !responseJson.data || !responseJson.data.productByHandle) {
            throw new Error('Product data is not available in the response');
        }

        const product = responseJson.data.productByHandle;
        return { props: { product } };
    } catch (error) {
        console.error('Error fetching product:', error);
        return { notFound: true };
    }
}

const ProductPage = ({ product }) => {
    const router = useRouter();
    const { addItemToCart } = useContext(CartContext);
    const [addingToCart, setAddingToCart] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [product]);

    const handleAddToCart = async () => {
        setAddingToCart(true);
        try {
            if (cartId) {
                await addItemToCart({
                    cartId: cartId,
                    itemId: product.id,
                    quantity: 1,
                });
            } else {
                const newCart = await createCartItem({ itemId: product.id, quantity: 1 });
                setCartId(newCart.id);
                localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify({ cartId: newCart.id }));
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
        setAddingToCart(false);
    };
    

    const handleProceedToCheckout = () => {
        router.push('/checkout');
    };

    if (router.isFallback || !product) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Head>
                <title>{product.title}</title>
                <meta name="description" content={product.description} />
            </Head>
            <Hero />
            <div className="container mx-auto p-4 flex flex-col md:flex-row">
                {/* Product image and details */}
                <div className="md:w-1/2">
                    <Image
                        src={product.images.edges[0]?.node.src || '/fallback-image.jpg'}
                        alt={product.images.edges[0]?.node.altText || 'Product Image'}
                        width={500}
                        height={500}
                        unoptimized
                    />
                </div>
                <div className="md:w-1/2 flex flex-col justify-center items-start p-4">
                    <h1 className="text-2xl font-bold">{product.title}</h1>
                    <p>{product.description}</p>
                    <p className="font-bold">Price: {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}</p>
                    <button 
                        onClick={handleAddToCart} 
                        disabled={addingToCart}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        {addingToCart ? 'Adding...' : 'Add to Cart'}
                    </button>
                    <button 
                        onClick={handleProceedToCheckout}
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </>
    );
};

export default ProductPage;
