import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Product from '@/components/Product';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useShopContext } from '/contexts/shopContext';

export default function Shop({ products }) {
  const safeProducts = products || [];
  const shopPageRef = useRef(null);
  const { cart, loading, handleAddToCart } = useShopContext();

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

        <div className="flex flex-wrap -mx-2">
          {safeProducts.map((product) => (
            <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4 product-item">
              <Product
                product={product}
                isSoldOut={!product.availableForSale}
                onAddToCart={() => handleAddToCartClick(product)}
              />
            </div>
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
          products(first: 10, sortKey: PRICE, reverse: true) {
            edges {
              node {
                id
                title
                handle
                description
                availableForSale
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

    const products = responseJson.data.collectionByHandle.products.edges.map((edge) => ({
      id: edge.node.id,
      title: edge.node.title,
      handle: edge.node.handle,
      description: edge.node.description,
      availableForSale: edge.node.availableForSale,
      imageSrc: edge.node.images.edges[0]?.node.src || "/fallback-image.jpg",
      imageAlt: edge.node.images.edges[0]?.node.altText || "Product Image",
      price: parseFloat(edge.node.variants.edges[0]?.node.priceV2.amount || "0").toFixed(2),
      variantId: edge.node.variants.edges[0]?.node.id || null,
    }));

    return { props: { products } };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { props: { products: [] } };
  }
}
