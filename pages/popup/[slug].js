import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import Hero from '@/components/Hero';
import { IoChevronBack, IoChevronForward } from 'react-icons/io5';

export default function PopupProductPage({ product }) {
  const router = useRouter();
  const { handleAddToCart } = useShopContext();

  if (router.isFallback || !product) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  const images = product.allImages?.length ? product.allImages : [product.imageSrc];
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);

  const prevImage = () => {
    setCurrentImageIdx((idx) => (idx > 0 ? idx - 1 : images.length - 1));
  };

  const nextImage = () => {
    setCurrentImageIdx((idx) => (idx < images.length - 1 ? idx + 1 : 0));
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push('/checkout');
  };

  return (
    <>
      <Hero />

      <div className="container mx-auto px-4 py-8 lg:py-12 flex flex-col lg:flex-row gap-10 lg:items-start bg-white text-black transition-colors duration-300">

        {/* LEFT: Image & Thumbnails */}
        <div className="w-full lg:max-w-[550px] mx-auto lg:mx-0">
          <div className="relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden shadow">
            <Image
              src={images[currentImageIdx]}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
            {images.length > 1 && (
              <>
                <button className="modal-arrow left" onClick={prevImage}>
                  <IoChevronBack size={24} />
                </button>
                <button className="modal-arrow right" onClick={nextImage}>
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
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`border rounded-md overflow-hidden ${
                    currentImageIdx === idx ? 'border-black' : 'border-transparent'
                  }`}
                >
                  <Image
                    src={src}
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

        {/* RIGHT: Product Info */}
        <div className="w-full lg:max-w-md">
          <h1 className="text-2xl lg:text-3xl font-bold text-black mb-2">{product.title}</h1>
          <p className="text-xl text-gray-700 font-semibold mb-2">
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}
          </p>

          {/* Conversion Enhancers */}
          <div className="mb-4">
            <p className="text-sm text-red-600 font-medium mb-1">Only a few left in stock</p>
            <p className="text-sm text-gray-600">Ships in 3–5 business days</p>
          </div>

          {/* Variant Selector */}
          <div className="mb-4">
            <label className="block font-semibold text-black mb-1">Edition / Size</label>
            <select
              className="w-full border rounded p-3"
              value={selectedVariant.id}
              onChange={(e) =>
                setSelectedVariant(product.variantOptions.find(v => v.id === e.target.value))
              }
            >
              {product.variantOptions.map((variant) => (
                <option key={variant.id} value={variant.id}>
                  {variant.title} - ${parseFloat(variant.price.amount).toFixed(2)}
                </option>
              ))}
            </select>
          </div>

          {/* CTAs */}
          <div className="space-y-3 mb-6">
            <button
              className="w-full bg-black text-white py-3 rounded text-lg font-medium"
              onClick={() => handleAddToCart(selectedVariant.id, 1)}
            >
              Add to Cart
            </button>
            <button
              className="w-full bg-yellow-400 text-black py-3 rounded text-lg font-semibold"
              onClick={handleBuyNow}
            >
              Buy It Now
            </button>
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t pt-4">
              <h3 className="text-lg font-semibold mb-2 text-black">Details</h3>
              <p className="text-sm leading-relaxed text-gray-800 whitespace-pre-line">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const endpoint = `https://${process.env.NEXT_PUBLIC_SHOPIFY_DOMAIN}/api/2023-10/graphql.json`;
  const token = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

  const graphqlQuery = {
    query: `
      query getPopupProducts {
        collectionByHandle(handle: "popup-shop") {
          products(first: 100) {
            edges {
              node {
                handle
              }
            }
          }
        }
      }
    `,
  };

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': token,
    },
    body: JSON.stringify(graphqlQuery),
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

  const graphqlQuery = {
    query: `
      query GetPopupProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          description
          images(first: 10) {
            edges {
              node {
                src
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
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
    body: JSON.stringify(graphqlQuery),
  });

  const responseJson = await res.json();
  const node = responseJson.data.productByHandle;

  const product = {
    id: node.id,
    title: node.title,
    handle: node.handle,
    description: node.description,
    imageSrc: node.images.edges[0]?.node.src || "/fallback-image.jpg",
    allImages: node.images.edges.map(edge => edge.node.src),
    variantOptions: node.variants.edges.map(edge => ({
      id: edge.node.id,
      title: edge.node.title,
      price: edge.node.priceV2,
    })),
  };

  return { props: { product } };
}
