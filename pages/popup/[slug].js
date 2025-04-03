import { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import Hero from "@/components/Hero";
import { useShopContext } from "@/contexts/shopContext";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

export async function getStaticPaths() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = {
    query: `
      {
        collectionByHandle(handle: "popup-shop") {
          products(first: 100) {
            edges { node { handle } }
          }
        }
      }`,
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(query),
  });

  const responseJson = await res.json();
  const paths = responseJson.data.collectionByHandle.products.edges.map(({ node }) => ({
    params: { slug: node.handle },
  }));

  return { paths, fallback: true };
}

export async function getStaticProps({ params }) {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const query = {
    query: `
      query GetPopupProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          images(first: 10) {
            edges { node { src altText } }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                availableForSale
                priceV2 { amount currencyCode }
              }
            }
          }
        }
      }
    `,
    variables: { handle: params.slug },
  };

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify(query),
  });

  const responseJson = await res.json();
  const node = responseJson.data.productByHandle;

  const product = {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    imageSrc: node.images.edges[0]?.node.src || "/fallback-image.jpg",
    altImageSrc: node.images.edges[1]?.node.src || null,
    allImages: node.images.edges.map((edge) => edge.node.src),
    variantOptions: node.variants.edges.map((edge) => edge.node),
  };

  return { props: { product } };
}

export default function PopupProductPage({ product }) {
  const router = useRouter();
  const { handleAddToCart } = useShopContext();
  const images = product.allImages.length ? product.allImages : [product.imageSrc];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);

  useEffect(() => {
    setMainImage(images[0]);
    setSelectedVariant(product.variantOptions[0]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product]);

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push("/checkout");
  };

  const handleNotifyClick = () => {
    if (window._klOnsite) {
      window._klOnsite.push(["openForm", "RjNi3C"]);
    }
  };

  if (router.isFallback || !product) return <div className="text-center py-20">Loading product…</div>;

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Hero />

      <section className="bg-white text-black px-4 py-12 transition-colors duration-300">
        <div className="container mx-auto flex flex-col lg:flex-row gap-10">
          {/* LEFT: Gallery */}
          <div className="w-full lg:max-w-[550px]">
            <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow">
              <Image src={mainImage} alt={product.title} layout="fill" objectFit="cover" className="rounded-lg" />
              {!selectedVariant.availableForSale && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold px-3 py-1">Sold Out</div>
              )}
              {images.length > 1 && (
                <>
                  <button className="modal-arrow left" onClick={() => setCurrentImageIdx((i) => (i > 0 ? i - 1 : images.length - 1))}>
                    <IoChevronBack size={24} />
                  </button>
                  <button className="modal-arrow right" onClick={() => setCurrentImageIdx((i) => (i < images.length - 1 ? i + 1 : 0))}>
                    <IoChevronForward size={24} />
                  </button>
                </>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto">
                {images.map((src, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMainImage(src);
                      setCurrentImageIdx(idx);
                    }}
                    className={`border rounded-md overflow-hidden ${currentImageIdx === idx ? "border-black" : "border-transparent"}`}
                  >
                    <Image src={src} alt={`Thumb ${idx}`} width={80} height={100} className="thumbnail-image" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Details */}
          <div className="w-full lg:max-w-md">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

            {product.description && (
              <p className="text-sm italic text-gray-600 mb-4">{product.description}</p>
            )}

            <p className="text-xl font-semibold mb-4">
              ${parseFloat(selectedVariant.priceV2.amount).toFixed(2)}
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Edition / Size</label>
              <select
                value={selectedVariant.id}
                onChange={(e) => setSelectedVariant(product.variantOptions.find((v) => v.id === e.target.value))}
                className="w-full border rounded p-2"
              >
                {product.variantOptions.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.title}
                  </option>
                ))}
              </select>
            </div>

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

            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <ul className="grid grid-cols-1 gap-2 text-sm text-gray-800 leading-relaxed list-inside">
                <li className="flex items-start">
                  <span className="text-black mt-1">•</span>
                  <span className="ml-2">Printed on museum-grade archival Hahnemühle Baryta paper</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mt-1">•</span>
                  <span className="ml-2">Each print is hand-signed, hand-numbered, and embossed for authenticity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mt-1">•</span>
                  <span className="ml-2">Sourced from the original RAW file — ultra high-resolution fidelity</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mt-1">•</span>
                  <span className="ml-2">Limited to only 10 editions per image</span>
                </li>
                <li className="flex items-start">
                  <span className="text-black mt-1">•</span>
                  <span className="ml-2">Print size: 16 x 20 inches</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
