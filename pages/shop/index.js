import React, { useRef, useEffect, useState } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Product from '@/components/Product';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useShopContext } from '@/contexts/shopContext';

export default function Shop({ products }) {
  const shopPageRef = useRef(null);
  const { cart, loading, handleAddToCart } = useShopContext();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useSmoothScroll('#shop', shopPageRef);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=${process.env.NEXT_PUBLIC_KLAVIYO_API_KEY}`;
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  const handleAddToCartClick = async (product) => {
    if (!cart || loading) return;
    try {
      await handleAddToCart(product.variantId, 1);
    } catch (err) {
      console.error('Add to cart failed:', err);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
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

  const query = {
    query: `
      query {
        collectionByHandle(handle: "shop") {
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
                    node { src altText }
                  }
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      priceV2 { amount currencyCode }
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
      body: JSON.stringify(query),
    });

    const json = await res.json();
    const nodes = json.data.collectionByHandle.products.edges.map(({ node }) => {
      const variants = node.variants.edges.map((v) => v.node);
      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        availableForSale: node.availableForSale,
        imageSrc: node.images.edges[0]?.node.src || '/fallback-image.jpg',
        imageAlt: node.images.edges[0]?.node.altText || 'Product Image',
        price: variants[0]?.priceV2?.amount,
        variantId: variants[0]?.id,
      };
    });

    return { props: { products: nodes } };
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return { props: { products: [] } };
  }
}
