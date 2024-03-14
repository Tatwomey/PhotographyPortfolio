import React, { useRef, useEffect } from "react";
import Head from "next/head";
import Hero from "@/components/Hero";
import Product from "@/components/Product";
import { useShopContext } from '@/contexts/shopContext';

export default function Shop({ products }) {
    const productListRef = useRef(null);s
    const { addToCart } = useShopContext();

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
            // Check if the variant ID is available
            if (!product.variantId) {
                console.error('Variant ID is missing for the product');
                return; // Exit the function if no variant ID
            }
    
            console.log('Variant ID:', product.variantId);
    
            const title = product.title;
            const price = product.price || '0';
            const image = product.imageSrc;
    
            await addToCart({
                variantId: product.variantId,
                quantity: 1,
                title,
                price,
                image
            });
            alert('Added to cart!');
        } catch (error) {
            console.error('Error in handleAddToCart:', error);
        }
    };
    
    
    const safeProducts = products || [];

    return (
        <>
            <Head>
                <title>The Shop</title>
                <meta name="description" content="Shop for our products" />
            </Head>
            <Hero />
            <div ref={productListRef} className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Shop</h1>
                <div className="flex flex-wrap -mx-2">
                    {safeProducts.map((product) => (
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
                  variants(first: 1) {
                    edges {
                      node {
                        id
                        priceV2 {
                          amount
                          currencyCode
                        }
                      }
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

        const products = responseJson.data.products.edges.map(edge => {
            const variant = edge.node.variants.edges[0]?.node;
            return {
                id: edge.node.id,
                title: edge.node.title,
                handle: edge.node.handle,
                description: edge.node.description,
                imageSrc: edge.node.images.edges[0]?.node.src || '/fallback-image.jpg',
                imageAlt: edge.node.images.edges[0]?.node.altText || 'Product Image',
                price: variant?.priceV2.amount || '0',
                variantId: variant?.id || null
            };
        });
        
        console.log("Products with Variant ID:", products);

        return { props: { products }};
    } catch (error) {
        return { props: { products:
            [] } };
    }
}
    
