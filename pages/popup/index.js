import React, { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import PopupProductCard from '@/components/PopupProductCard';
import PopupProductQuickView from '@/components/PopupProductQuickView';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useShopContext } from '/contexts/shopContext';

export default function PopupShop({ products }) {
  const safeProducts = products || [];
  const shopPageRef = useRef(null);
  const { cart, loading, handleAddToCart } = useShopContext();

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useSmoothScroll('#popup', shopPageRef);

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
    <>
      <Head>
        <title>Popup Shop</title>
        <meta name="description" content="Shop exclusive popup items" />
      </Head>

      <Hero />

      <main id="popup" ref={shopPageRef} className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {safeProducts.map((product) => (
            <PopupProductCard
              key={product.id}
              product={product}
              onQuickView={() => setQuickViewProduct(product)}
              onAddToCart={handleAddToCartClick}
            />
          ))}
        </div>
      </main>

      {quickViewProduct && (
        <PopupProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={handleAddToCartClick}
        />
      )}
    </>
  );
}

export async function getStaticProps() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query getPopupProducts {
        collectionByHandle(handle: "popup-shop") {
          products(first: 100) {
            edges {
              node {
                id
                title
                handle
                description
                availableForSale
                images(first: 2) {
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
                      selectedOptions {
                        name
                        value
                      }
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
        variantId: variants[0]?.id || null,
        variantOptions: variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.priceV2,
          available: v.availableForSale,
          options: v.selectedOptions
        })),
      };
    });

    return { props: { products } };
  } catch (error) {
    console.error("Error fetching popup products:", error);
    return { props: { products: [] } };
  }
}
