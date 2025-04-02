import React, { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import { useShopContext } from "@/contexts/shopContext";

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

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(graphqlQuery),
  });

  const responseJson = await res.json();
  const paths = responseJson.data.products.edges.map(({ node }) => ({
    params: { slug: node.handle },
  }));

  return { paths, fallback: "blocking" };
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
          variants(first: 10) {
            edges {
              node {
                id
                title
                priceV2 { amount currencyCode }
                availableForSale
              }
            }
          }
        }
      }`,
    variables: { handle: params.slug },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(graphqlQuery),
  });

  const responseJson = await res.json();
  const node = responseJson.data.productByHandle;

  const product = {
    ...node,
    images: node.images.edges.map((e) => e.node),
    variants: node.variants.edges.map((e) => e.node),
  };

  return { props: { product } };
}

export default function ShopSlug({ product }) {
  const router = useRouter();
  const { handleAddToCart } = useShopContext();

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [mainImage, setMainImage] = useState(product.images[0]?.src);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  const handleNotifyClick = () => {
    if (window._klOnsite) {
      window._klOnsite.push(["openForm", "RjNi3C"]);

    }
  };

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Hero />

      <main className="bg-white text-black px-4 py-12 container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Gallery */}
          <div className="w-full lg:max-w-[550px]">
            <div className="relative aspect-[4/5] bg-gray-100 rounded overflow-hidden shadow">
              <Image
                src={mainImage}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="rounded"
              />
              {!selectedVariant.availableForSale && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold px-3 py-1">
                  Sold Out
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(img.src);
                      setCurrentImageIdx(idx);
                    }}
                    className={`border rounded-md overflow-hidden ${
                      currentImageIdx === idx ? "border-black" : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img.src}
                      alt={`Thumb ${idx}`}
                      width={80}
                      height={100}
                      className="thumbnail-image"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info */}
          <div className="w-full lg:max-w-md">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-xl font-semibold mb-4">
              ${parseFloat(selectedVariant.priceV2.amount).toFixed(2)}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Select Size</label>
              <select
                value={selectedVariant.id}
                onChange={(e) =>
                  setSelectedVariant(
                    product.variants.find((v) => v.id === e.target.value)
                  )
                }
                className="w-full border rounded p-2"
              >
                {product.variants.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-6">
              {selectedVariant.availableForSale ? (
                <>
                  <button
                    onClick={() => handleAddToCart(selectedVariant.id, 1)}
                    className="w-full bg-black text-white py-3 rounded text-lg font-medium"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full bg-yellow-400 text-black py-3 rounded text-lg font-semibold"
                  >
                    Buy It Now
                  </button>
                </>
              ) : (
                <button
                  onClick={handleNotifyClick}
                  className="w-full border border-black py-3 rounded text-lg font-semibold hover:bg-gray-100"
                >
                  Notify Me When Back in Stock
                </button>
              )}
            </div>

            {product.description && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Details</h3>
                <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
