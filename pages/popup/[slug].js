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

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10 items-start">
        {/* Left: Image Section */}
        <div className="flex flex-col items-center lg:w-[60%] w-full">
          <div className="relative w-full max-w-[500px] aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
            {/* Arrows */}
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

            <Image
              src={images[currentImageIdx]}
              alt={product.title}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>

          {/* Thumbnails */}
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
                    className="thumbnail-image object-cover rounded"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details */}
        <div className="lg:w-[40%] w-full">
          <h1 className="text-3xl font-bold mb-2 text-black">{product.title}</h1>
          <p className="text-xl mb-4 text-gray-700 font-semibold">
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}
          </p>

          <select
            className="w-full border rounded p-3 mb-4"
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

          <button
            className="w-full bg-black text-white py-3 rounded mb-2"
            onClick={() => handleAddToCart(selectedVariant.id, 1)}
          >
            Add to Cart
          </button>

          <button
            className="w-full bg-yellow-400 text-black py-3 rounded font-semibold"
            onClick={handleBuyNow}
          >
            Buy It Now
          </button>

          {product.description && (
            <div className="mt-6 border-t pt-4 text-black">
              <h3 className="font-semibold mb-2">Description</h3>
              <p>{product.description}</p>
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
