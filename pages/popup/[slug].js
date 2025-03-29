import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Hero from "@/components/Hero";
import { useRouter } from "next/router";
import { useShopContext } from "/contexts/shopContext";
import Image from "next/image";
import { fetchCart } from "@/lib/shopify";

export async function getStaticPaths() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      {
        products(first: 100) {
          edges {
            node {
              handle
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

    const json = await res.json();
    const paths = json.data.products.edges.map((edge) => ({
      params: { slug: edge.node.handle },
    }));

    return { paths, fallback: "blocking" };
  } catch (err) {
    console.error("Failed to generate static paths:", err);
    return { paths: [], fallback: "blocking" };
  }
}

export async function getStaticProps({ params }) {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query ProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          images(first: 10) {
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
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
        }
      }`,
    variables: { handle: params.slug },
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

    const json = await res.json();
    const product = json.data.productByHandle;

    if (!product) return { notFound: true };

    return { props: { product } };
  } catch (err) {
    console.error("Failed to fetch product data:", err);
    return { notFound: true };
  }
}

const ProductPage = ({ product }) => {
  const router = useRouter();
  const productRef = useRef(null);
  const { handleAddToCart, cartLoading, cart, refreshCart } = useShopContext();

  const [mainImage, setMainImage] = useState(
    product.images.edges[0]?.node.src || "/fallback-image.jpg"
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node || null
  );
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (productRef.current) {
      window.scrollTo({
        top: productRef.current.offsetTop,
        behavior: "smooth",
      });
    }
  }, [product]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const handleThumbnailClick = (src) => setMainImage(src);

  const handleAddToCartClick = async () => {
    if (!cart || !selectedVariant || cartLoading) return;
    setAddingToCart(true);
    try {
      await handleAddToCart(selectedVariant.id, 1);
      alert("Added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    if (!cart || !selectedVariant || cartLoading) return;
    setAddingToCart(true);
    try {
      await handleAddToCart(selectedVariant.id, 1);
      const localCartId = localStorage.getItem("shopify_cart_id");
      const updatedCart = await fetchCart(localCartId);
      if (updatedCart?.checkoutUrl) window.location.href = updatedCart.checkoutUrl;
    } catch (err) {
      console.error("Buy now failed:", err);
    }
    setAddingToCart(false);
  };

  if (router.isFallback || !product) return <div>Loading...</div>;

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Hero />
      <main ref={productRef} className="container mx-auto p-4 md:p-8 pb-20">
        <div className="bg-white p-6 md:p-10 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 flex flex-col items-center space-y-4">
            <div className="relative w-full aspect-[4/5]">
              <Image
                src={mainImage}
                alt="Main product image"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
                unoptimized
              />
            </div>
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
              {product.images.edges.map((img, idx) => (
                <div
                  key={idx}
                  className="w-16 h-16 md:w-24 md:h-24 border border-gray-200 rounded-lg overflow-hidden cursor-pointer"
                  onClick={() => handleThumbnailClick(img.node.src)}
                >
                  <Image
                    src={img.node.src}
                    alt={img.node.altText || "Thumbnail"}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                    unoptimized
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 flex flex-col justify-start items-start text-black space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold">{product.title}</h1>
            <p className="text-md md:text-lg">{product.description}</p>
            <p className="text-xl md:text-2xl font-bold">
              {parseFloat(selectedVariant?.priceV2?.amount).toFixed(2)}{" "}
              {selectedVariant?.priceV2?.currencyCode}
            </p>

            <div className="w-full">
              <label htmlFor="variant" className="block mb-1 font-medium">
                Size
              </label>
              <select
                id="variant"
                name="variant"
                className="w-full border rounded p-2"
                onChange={(e) => {
                  const newVariant = product.variants.edges.find(
                    (v) => v.node.id === e.target.value
                  );
                  setSelectedVariant(newVariant?.node);
                }}
                value={selectedVariant?.id}
              >
                {product.variants.edges.map(({ node }) => (
                  <option key={node.id} value={node.id}>
                    {node.selectedOptions[0]?.value || "Default"}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
              {selectedVariant?.availableForSale && (
                <button
                  onClick={handleAddToCartClick}
                  disabled={addingToCart}
                  className="w-full md:w-auto bg-white text-black border border-black font-bold py-2 px-4 rounded"
                >
                  {addingToCart ? "Adding..." : "Add to Cart"}
                </button>
              )}
              <button
                onClick={handleBuyNow}
                disabled={!selectedVariant?.availableForSale}
                className={`w-full md:w-auto font-bold py-2 px-4 rounded ${
                  selectedVariant?.availableForSale
                    ? "bg-black text-white"
                    : "bg-gray-400 text-gray-200"
                }`}
              >
                {selectedVariant?.availableForSale ? "Buy it Now" : "Sold Out"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
