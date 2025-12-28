import React, { useEffect, useMemo, useRef, useState } from "react";
import Head from "next/head";
import PopupHero from "@/components/PopupHero";
import PopupProductCard from "@/components/PopupProductCard";
import PopupProductQuickView from "@/components/PopupProductQuickView";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { useShopContext } from "@/contexts/shopContext";

function pushDataLayer(payload) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export default function PopupShop({ products }) {
  const safeProducts = products || [];
  const shopPageRef = useRef(null);
  const { cart, loading, addItemToCart, openCart } = useShopContext();

  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const quickViewStartMsRef = useRef(null);

  useSmoothScroll("#popup", shopPageRef);

  // Stable portfolio_id for this page (used across events)
  const portfolioId = useMemo(() => "popup_index", []);

  // Optional: log a product impression batch when list loads
  useEffect(() => {
    if (!safeProducts.length) return;
    pushDataLayer({
      event: "product_impression",
      portfolio_id: portfolioId,
      count: safeProducts.length,
    });
  }, [safeProducts.length, portfolioId]);

  const handleAddToCartClick = async (product, quantity = 1) => {
    if (loading || !cart) {
      console.error("Cart is still loading or not available. Please wait.");
      return;
    }

    try {
      await addItemToCart(product.variantId, quantity);
      openCart();

      pushDataLayer({
        event: "add_to_cart",
        portfolio_id: portfolioId,
        product_id: product.handle,
        product_title: product.title,
        variant_id: product.variantId || null,
        quantity,
        sold_out: !product.availableForSale,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      pushDataLayer({
        event: "add_to_cart_error",
        portfolio_id: portfolioId,
        product_id: product.handle,
        error_message: String(error?.message || error),
      });
    }
  };

  const openQuickView = (product) => {
    quickViewStartMsRef.current = performance.now();
    setQuickViewProduct(product);

    pushDataLayer({
      event: "quick_view_open",
      portfolio_id: portfolioId,
      product_id: product.handle,
      product_title: product.title,
      sold_out: !product.availableForSale,
    });
  };

  const closeQuickView = () => {
    const product = quickViewProduct;
    setQuickViewProduct(null);

    const start = quickViewStartMsRef.current;
    if (product && typeof start === "number") {
      const durationMs = Math.round(performance.now() - start);
      const capped = Math.min(Math.max(durationMs, 0), 10 * 60 * 1000);

      pushDataLayer({
        event: "quick_view_close",
        portfolio_id: portfolioId,
        product_id: product.handle,
        duration_ms: capped,
      });
    }

    quickViewStartMsRef.current = null;
  };

  const trackProductClick = (product) => {
    pushDataLayer({
      event: "product_click",
      portfolio_id: portfolioId,
      product_id: product.handle,
      product_title: product.title,
      sold_out: !product.availableForSale,
      click_source: "popup_grid",
    });
  };

  return (
    <div className="bg-white text-black w-full min-h-screen transition-colors duration-300">
      <Head>
        <title>Popup Shop</title>
        <meta name="description" content="Shop exclusive popup items" />
      </Head>

      <PopupHero />

      <main
        id="popup"
        ref={shopPageRef}
        className="max-w-[1440px] mx-auto px-4 py-16 bg-white text-black transition-colors duration-300">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {safeProducts.map((product) => (
            <PopupProductCard
              key={product.id}
              product={product}
              portfolioId={portfolioId}
              onProductClick={() => trackProductClick(product)}
              onQuickView={() => openQuickView(product)}
            />
          ))}
        </div>
      </main>

      {quickViewProduct && (
        <PopupProductQuickView
          product={quickViewProduct}
          onClose={closeQuickView}
          onAddToCart={(p) => handleAddToCartClick(p, 1)}
        />
      )}
    </div>
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

    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

    const responseJson = await res.json();
    const edges = responseJson?.data?.collectionByHandle?.products?.edges || [];

    const products = edges.map(({ node }) => {
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
        allImages: node.images.edges.map((edge) => edge.node.src),
        variantId: variants[0]?.id || null, // used by your cart context
        variantOptions: variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.priceV2,
          available: v.availableForSale,
          options: v.selectedOptions,
        })),
      };
    });

    return { props: { products } };
  } catch (error) {
    console.error("Error fetching popup products:", error);
    return { props: { products: [] } };
  }
}
