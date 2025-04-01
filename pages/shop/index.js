import React, { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Product from '@/components/Product';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useShopContext } from '@/contexts/shopContext';

export default function Shop({ products }) {
  const safeProducts = products || [];
  const shopPageRef = useRef(null);
  const { cart, loading, handleAddToCart } = useShopContext();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useSmoothScroll('#shop', shopPageRef);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_API_KEY}`;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleAddToCartClick = async (product) => {
    if (loading || !cart) {
      console.error('Cart is still loading or not available. Please wait.');
      return;
    }

    try {
      await handleAddToCart(product.variantId, 1);
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div className="bg-white text-black w-full min-h-screen transition-colors duration-300">
      <Head>
        <title>The Shop</title>
        <meta name="description" content="Shop our exclusive products" />
      </Head>

      <Hero />

      <main
        id="shop"
        ref={shopPageRef}
        className="max-w-7xl mx-auto px-4 py-16 bg-white text-black transition-colors duration-300"
      >
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {safeProducts.map((product) => (
            <Product
              key={product.id}
              product={product}
              isSoldOut={!product.availableForSale}
              onAddToCart={() => handleAddToCartClick(product)}
            />
          ))}
        </div>
      </main>
    </div>
  );
}

export async function getStaticProps() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query getProductList {
        collectionByHandle(handle: "shop") {
          products(first: 100, sortKey: PRICE, reverse: true) {
            edges {
              node {
                id
                title
                handle
                description
                availableForSale
                images(first: 10) {
                  edges {
                    node {
                      src
                      altText
                    }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      availableForSale
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
      }
    `,
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const responseJson = await res.json();

    const products = responseJson.data.collectionByHandle.products.edges.map(({ node }) => {
      const variants = node.variants.edges.map((v) => v.node);
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        availableForSale: node.availableForSale,
        imageSrc: node.images.edges[0]?.node.src || "/fallback-image.jpg",
        altImageSrc: node.images.edges[1]?.node.src || null,
        imageAlt: node.images.edges[0]?.node.altText || "Product Image",
        allImages: node.images.edges.map(edge => edge.node.src),
        variantId: variants[0]?.id || null,
        variantOptions: variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.priceV2,
          available: v.availableForSale,
        })),
      };
    });

    return { props: { products } };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { props: { products: [] } };
  }
}
