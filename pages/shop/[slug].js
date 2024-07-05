import React, { useEffect, useRef, useState } from "react";
import Head from "next/head";
import Hero from "@/components/Hero";
import Image from "next/image";
import { useRouter } from "next/router";
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

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify(graphqlQuery),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const responseJson = await res.json();
    const paths = responseJson.data.products.edges.map((edge) => ({
      params: { slug: edge.node.handle },
    }));

    return { paths, fallback: "blocking" };
  } catch (error) {
    console.error("Failed to fetch product paths:", error);
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

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const responseJson = await res.json();
    if (!responseJson || !responseJson.data || !responseJson.data.productByHandle) {
      throw new Error("Product data is not available in the response");
    }

    const product = responseJson.data.productByHandle;
    return { props: { product } };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true };
  }
}

const ProductPage = ({ product }) => {
  const router = useRouter();
  const { handleAddToCart } = useShopContext();
  const [addingToCart, setAddingToCart] = useState(false);
  const productRef = useRef(null);

  const [mainImage, setMainImage] = useState(
    product.images.edges[0]?.node.src || "/fallback-image.jpg"
  );
  const [selectedVariant, setSelectedVariant] = useState(
    product.variants.edges[0]?.node
  );

  useEffect(() => {
    if (productRef.current) {
      window.scrollTo({
        top: productRef.current.getBoundingClientRect().top + window.scrollY,
        behavior: "smooth",
      });
    }
  }, [product]);

  const handleThumbnailClick = (imageSrc) => {
    setMainImage(imageSrc);
  };

  const handleVariantChange = (event) => {
    const variant = product.variants.edges.find(
      (v) => v.node.id === event.target.value
    );
    setSelectedVariant(variant.node);
  };

  const handleAddToCartClick = async () => {
    setAddingToCart(true);
    try {
      const variantId = selectedVariant.id;
      await handleAddToCart({
        variantId,
        quantity: 1,
      });
      alert("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    setAddingToCart(false);
  };

  const handleBuyNow = async () => {
    setAddingToCart(true);
    try {
      const variantId = selectedVariant.id;
      await handleAddToCart({
        variantId,
        quantity: 1,
      });

      // Ensure cart is updated before navigating
      let localCart = JSON.parse(localStorage.getItem('trevortwomeyphoto:Shopify:cart'));
      if (localCart && localCart.cartId) {
        const updatedCart = await loadCart(localCart.cartId);
        localStorage.setItem('trevortwomeyphoto:Shopify:cart', JSON.stringify(updatedCart));
        localCart = updatedCart;
      }
      
      if (localCart && localCart.checkoutUrl) {
        console.log('Redirecting to checkout:', localCart.checkoutUrl);
        window.location.href = localCart.checkoutUrl;
      } else {
        console.error('Checkout URL not found in cart:', localCart);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
    setAddingToCart(false);
  };

  if (router.isFallback || !product) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Head>
        <title>{product.title}</title>
        <meta name="description" content={product.description} />
      </Head>
      <Hero />
      <main ref={productRef} className="container mx-auto p-4 md:p-8 pb-20">
        <div className="bg-white p-4 md:p-8 rounded-lg shadow-md flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 flex flex-col items-center space-y-4">
            <div className="relative w-full h-80 md:h-[600px]">
              <Image
                src={mainImage}
                alt="Main Product Image"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
                unoptimized
              />
            </div>
            <div className="flex space-x-2 md:space-x-4 overflow-x-auto">
              {product.images.edges.map((image, index) => (
                <div
                  key={index}
                  className="relative w-16 h-16 md:w-24 md:h-24 cursor-pointer border border-gray-200 rounded-lg overflow-hidden"
                  onClick={() => handleThumbnailClick(image.node.src)}
                >
                  <Image
                    src={image.node.src || "/fallback-image.jpg"}
                    alt={image.node.altText || "Product Thumbnail"}
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
              {parseFloat(selectedVariant.priceV2.amount).toFixed(2)}{" "}
              {selectedVariant.priceV2.currencyCode}
            </p>
            <div className="w-full">
              <label htmlFor="variant" className="block mb-1 font-medium">
                Size
              </label>
              <select
                id="variant"
                name="variant"
                className="w-full border rounded p-2"
                onChange={handleVariantChange}
                value={selectedVariant.id}
              >
                {product.variants.edges.map((variant) => (
                  <option key={variant.node.id} value={variant.node.id}>
                    {(variant.node.selectedOptions &&
                      variant.node.selectedOptions.find(
                        (option) => option.name === "Size"
                      )?.value) ||
                      "Default"}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full">
              <button
                onClick={handleAddToCartClick}
                disabled={addingToCart}
                className="w-full md:w-auto bg-white text-black border border-black font-bold py-2 px-4 rounded"
              >
                {addingToCart ? "Adding..." : "Add to Cart"}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={addingToCart}
                className="w-full md:w-auto bg-black text-white font-bold py-2 px-4 rounded"
              >
                {addingToCart ? "Processing..." : "Buy it Now"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductPage;
