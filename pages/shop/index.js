// pages/shop/index.js
import React, { useRef, useEffect, useContext } from "react";
import Head from "next/head";
import Hero from "@/components/Hero";
import Product from "@/components/Product";
import { CartContext } from '@/contexts/CartContext';

export default function Shop({ products }) {
    const productListRef = useRef(null);
    const { cartId, setCartId, addItemToCart } = useContext(CartContext); // Include cartId and setCartId

    useEffect(() => {
        if (productListRef.current) {
            window.scroll({
                top: productListRef.current.getBoundingClientRect().top + window.scrollY,
                behavior: 'smooth',
            });
        }
    }, []);

    const handleAddToCart = async (product) => {
        try {
            if (cartId) {
                // Add item to existing cart
                addItemToCart({
                    cartId: cartId,
                    itemId: product.id,
                    quantity: 1,
                });
            } else {
                // Create a new cart and add the item
                const newCart = await createCartItem({ itemId: product.id, quantity: 1 });
                setCartId(newCart.id);
                localStorage.setItem('cartId', newCart.id);
            }
            alert('Added to cart!');
        } catch (error) {
            console.error('Error in handleAddToCart:', error);
            // Handle the error, e.g., display an error message to the user
        }
    };

    return (
        <>
            <Head>
                <title>Shop Page</title>
                <meta name="description" content="Shop for our products" />
            </Head>
            <Hero />
            <div ref={productListRef} className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Shop</h1>
                <div className="flex flex-wrap -mx-2">
                    {products.map((product) => (
                        <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
                            <Product product={product} onAddToCart={() => handleAddToCart(product)} />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export async function getStaticProps() {
    const endpoint = `https://${process.env.SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
    const token = process.env.SHOPIFY_STOREFRONT_API_TOKEN;

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
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Storefront-Access-Token': token,
            },
            body: JSON.stringify(graphqlQuery),
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const responseJson = await res.json();

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
