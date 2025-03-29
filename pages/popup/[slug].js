import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import Hero from '@/components/Hero';

export default function PopupProductPage({ product }) {
  const router = useRouter();
  const { handleAddToCart } = useShopContext();

  if (router.isFallback || !product) {
    return <div className="text-center py-20">Loading product...</div>;
  }

  const images = product.allImages?.length ? product.allImages : [product.imageSrc];
  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedVariant, setSelectedVariant] = useState(product.variantOptions[0]);

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push('/checkout');
  };

  return (
    <>
      <Hero />

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row gap-10">
        {/* Thumbnails Vertical (Desktop), Horizontal Scroll (Mobile) */}
        <div className="flex lg:flex-col gap-3 overflow-auto lg:overflow-visible">
          {images.map((src, idx) => (
            <button key={idx} onClick={() => setSelectedImage(src)}>
              <Image
                src={src}
                width={80}
                height={80}
                alt={`${product.title}-${idx}`}
                className={`rounded-lg object-cover ${selectedImage === src ? 'ring-2 ring-black' : ''}`}
              />
            </button>
          ))}
        </div>

        {/* Main Image */}
        <div className="flex-1 bg-gray-100 rounded-lg shadow-sm flex justify-center items-center">
          <Image
            src={selectedImage}
            width={800}
            height={1000}
            alt={product.title}
            className="object-contain rounded-lg"
          />
        </div>

        {/* Product Details */}
        <div className="lg:w-96 flex flex-col">
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="text-xl my-3 font-semibold">
            ${parseFloat(selectedVariant.price.amount).toFixed(2)}
          </p>

          <select
            className="w-full p-3 border rounded mb-4"
            value={selectedVariant.id}
            onChange={(e) => 
              setSelectedVariant(product.variantOptions.find(v => v.id === e.target.value))
            }
          >
            {product.variantOptions.map(v => (
              <option key={v.id} value={v.id}>
                {v.title} - ${parseFloat(v.price.amount).toFixed(2)}
              </option>
            ))}
          </select>

          <button
            className="bg-black text-white py-3 rounded w-full mb-2"
            onClick={() => handleAddToCart(selectedVariant.id, 1)}
          >
            Add to Cart
          </button>
          
          <button
            className="bg-yellow-400 text-black py-3 rounded w-full"
            onClick={handleBuyNow}
          >
            Buy It Now
          </button>

          <div className="mt-6 border-t pt-4">
            <p>{product.description}</p>
          </div>
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
          images(first: 5) {
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
