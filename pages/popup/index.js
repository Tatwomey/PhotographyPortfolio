// pages/popup/index.js

import React, { useMemo, useState } from "react";
import Head from "next/head";
import PopupHero from "@/components/PopupHero";
import PopupProductCard from "@/components/PopupProductCard";
import PopupProductQuickView from "@/components/PopupProductQuickView";
import { shopifyFetch } from "@/lib/shopify";

/* ----------------------------------------
   View modes (single source of truth)
----------------------------------------- */

const VIEW_MODES = {
  GRID_3: "grid-3",
  GRID_2: "grid-2",
};

/* ----------------------------------------
   GraphQL (FIXED for Shopify 2023-10)
----------------------------------------- */

const POPUP_PRODUCTS_QUERY = `
  query PopupProducts {
    collectionByHandle(handle: "popup-shop") {
      title
      products(first: 50) {
        edges {
          node {
            id
            title
            handle
            description
            images(first: 10) {
              edges {
                node {
                  url
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
                  image {
                    url
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/* ----------------------------------------
   Normalize for Quick View
----------------------------------------- */

function normalizeForQuickView(product) {
  const images =
    Array.isArray(product?.allImages) && product.allImages.length
      ? product.allImages.map((url) => ({ src: url }))
      : product?.imageSrc
        ? [{ src: product.imageSrc }]
        : [];

  return {
    ...product,
    images,
  };
}

/* ----------------------------------------
   Page
----------------------------------------- */

export default function Popup({ products }) {
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [viewMode, setViewMode] = useState(VIEW_MODES.GRID_3);

  const normalizedProducts = useMemo(
    () => products.map(normalizeForQuickView),
    [products],
  );

  const gridClassName =
    viewMode === VIEW_MODES.GRID_2
      ? "popup-grid popup-grid--2"
      : "popup-grid popup-grid--3";

  return (
    <>
      <Head>
        <title>Popup Shop | Trevor Twomey</title>
      </Head>

      <PopupHero />

      {/* Desktop view toggle */}
      <div className="popup-view-toggle">
        <span>View</span>

        <button
          className={viewMode === VIEW_MODES.GRID_3 ? "active" : ""}
          onClick={() => setViewMode(VIEW_MODES.GRID_3)}
          aria-label="3 column grid">
          <span className="icon-grid" />
        </button>

        <button
          className={viewMode === VIEW_MODES.GRID_2 ? "active" : ""}
          onClick={() => setViewMode(VIEW_MODES.GRID_2)}
          aria-label="2 column grid">
          <span className="icon-list" />
        </button>
      </div>

      {/* Grid */}
      <section className="popup-grid-wrapper">
        <div className={gridClassName}>
          {normalizedProducts.map((product) => (
            <PopupProductCard
              key={product.id}
              product={product}
              onQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      </section>

      {/* Quick View */}
      {quickViewProduct && (
        <PopupProductQuickView
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
}

/* ----------------------------------------
   Static Props
----------------------------------------- */

export async function getStaticProps() {
  const responseJson = await shopifyFetch(POPUP_PRODUCTS_QUERY);

  if (!responseJson?.data?.collectionByHandle) {
    return { props: { products: [] }, revalidate: 60 };
  }

  const products = responseJson.data.collectionByHandle.products.edges.map(
    ({ node }) => {
      const images = node.images?.edges?.map(({ node }) => node.url) || [];

      return {
        id: node.id,
        title: node.title,
        handle: node.handle,
        description: node.description,

        imageSrc: images[0] || null,
        altImageSrc: images[1] || null,
        allImages: images,

        variants: node.variants.edges.map(({ node }) => ({
          id: node.id,
          title: node.title,
          availableForSale: node.availableForSale,
          price: {
            amount: node.priceV2.amount,
            currencyCode: node.priceV2.currencyCode,
          },
          image: node.image?.url || null,
          selectedOptions: node.selectedOptions || [],
        })),
      };
    },
  );

  return {
    props: { products },
    revalidate: 60,
  };
}
