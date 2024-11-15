import React, { useRef, useEffect } from 'react';
import Head from 'next/head';
import Hero from '@/components/Hero';
import Product from '@/components/Product';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import { useShopContext } from '@/contexts/shopContext';
import { useRouter } from 'next/router';

export default function Popup({ products }) {
  const safeProducts = products || [];
  const popupPageRef = useRef(null);
  const { cart, loading, handleAddToCart } = useShopContext();
  const router = useRouter();

  // Redirect to #popup if the hash is not present
  useEffect(() => {
    if (window.location.hash !== '#popup') {
      router.replace('/popup#popup', undefined, { shallow: true });
    }
  }, []);

  useSmoothScroll('#popup', popupPageRef);

  useEffect(() => {
    // Placeholder for third-party scripts or environment specific scripts
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
    <>
      <Head>
        <title>Popup Shop</title>
        <meta name="description" content="Exclusive popup shop products" />
      </Head>
      <Hero />
      <main ref={popupPageRef} className="container mx-auto p-4 pb-20">
        <div className="flex flex-wrap -mx-2">
          {safeProducts.map((product) => (
            <div key={product.id} className="w-full sm:w-1/2 md:w-1/3 px-2 mb-4">
              <Product
                product={product}
                isSoldOut={!product.availableForSale}
                onAddToCart={() => handleAddToCartClick(product)}
              />
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

// Adjust the getStaticProps function to fetch popup exclusive products when necessary
export async function getStaticProps() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

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

    return { props: { products }};
  } catch (error) {
    console.error("Error fetching products:", error);
    return { props: { products: [] } };
  }
}
