// pages/popup/index.js
import React, { useRef, useState, useMemo } from "react";
import Head from "next/head";
import PopupHero from "@/components/PopupHero";
import PopupProductCard from "@/components/PopupProductCard";
import PopupProductQuickView from "@/components/PopupProductQuickView";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";

function normalizeForQuickView(p) {
  const images =
    Array.isArray(p?.allImages) && p.allImages.length
      ? p.allImages.map((src) => ({ src }))
      : [p?.imageSrc].filter(Boolean).map((src) => ({ src }));

  const variants = Array.isArray(p?.variantOptions)
    ? p.variantOptions.map((v) => ({
        id: v.id,
        title: v.title,
        price: v?.price?.amount ?? "0.00",
        availableForSale: v?.available ?? true,
        selectedOptions: v?.options ?? [],
        image: v?.image ?? null,
      }))
    : [];

  return {
    title: p?.title,
    handle: p?.handle,
    description: p?.description,
    images,
    variants,
  };
}

export default function PopupShop({ products }) {
  const safeProducts = Array.isArray(products) ? products : [];
  const shopPageRef = useRef(null);

  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useSmoothScroll("#popup", shopPageRef);

  const normalizedQuickViewProduct = useMemo(() => {
    if (!quickViewProduct) return null;
    return normalizeForQuickView(quickViewProduct);
  }, [quickViewProduct]);

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
              portfolioId="popup_index"
              // ✅ accept the product argument from the card
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </main>

      {normalizedQuickViewProduct && (
        <PopupProductQuickView
          product={normalizedQuickViewProduct}
          onClose={() => setQuickViewProduct(null)}
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
      const variants = node?.variants?.edges?.map((v) => v.node) || [];
      const images = node?.images?.edges?.map((e) => e.node) || [];

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,
        availableForSale: node.availableForSale,

        imageSrc: images[0]?.src || "/fallback-image.jpg",
        altImageSrc: images[1]?.src || null,
        imageAlt: images[0]?.altText || node.title,

        allImages: images.map((img) => img.src),

        variantId: variants[0]?.id || null,
        variantOptions: variants.map((v) => ({
          id: v.id,
          title: v.title,
          price: v.priceV2, // { amount, currencyCode }
          available: v.availableForSale,
          options: v.selectedOptions,
        })),
      };
    });

    return { props: { products }, revalidate: 60 };
  } catch (error) {
    console.error("Error fetching popup products:", error);
    return { props: { products: [] }, revalidate: 60 };
  }
}
