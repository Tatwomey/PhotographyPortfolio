import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import Hero from '@/components/Hero';
import ProductQuickView from '@/components/ProductQuickView';

export default function Shop({ products }) {
  const { handleAddToCart, loading } = useShopContext();
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const section = document.getElementById("shop");
    if (section && window.location.hash === "#shop") {
      setTimeout(() => {
        section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, []);

  return (
    <div className="bg-white text-black w-full min-h-screen">
      <Head>
        <title>Shop</title>
        <meta name="description" content="Limited edition fine art photography prints" />
      </Head>

      <Hero
        heading="Limited Edition Fine Art Prints"
        message="Signed and numbered by Trevor Twomey"
      />

      <main id="shop" className="max-w-[1440px] mx-auto px-4 pt-8 pb-20 scroll-mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              loading={loading}
              handleAddToCart={handleAddToCart}
              openQuickView={() => setQuickViewProduct(product)}
            />
          ))}
        </div>
      </main>

      {quickViewProduct && (
        <ProductQuickView
          product={quickViewProduct}
          selectedVariant={quickViewProduct.variantOptions[0]}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}

const ProductCard = ({ product, handleAddToCart, loading, openQuickView }) => {
  const [hovered, setHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(
    product.variantOptions.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === 'regular'
      )
    ) || product.variantOptions[0]
  );

  const getVariantByColor = (color) =>
    product.variantOptions.find((v) =>
      v.selectedOptions?.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === color.toLowerCase()
      )
    );

  const colorOptions = [...new Set(product.variantOptions
    .map((v) => v.selectedOptions?.find((opt) => opt.name.toLowerCase() === 'color')?.value)
    .filter(Boolean))];

  const displayImage =
    hovered && product.altImageSrc
      ? product.altImageSrc
      : selectedVariant?.image?.src || product.imageSrc;

  return (
    <div
      className="relative w-full bg-white group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!product.availableForSale && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded z-20">
          Sold out
        </div>
      )}

      <Link
        href={`/shop/${product.handle}`}
        className="block aspect-[4/5] w-full overflow-hidden relative"
      >
        <Image
          src={displayImage}
          alt={product.imageAlt || product.title}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover rounded-md transition duration-300 ease-in-out"
          unoptimized
        />
      </Link>

      {colorOptions.length > 1 && (
        <div className="absolute bottom-[54px] right-2 flex gap-1 z-10">
          {colorOptions.map((color) => {
            const variant = getVariantByColor(color);
            return (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedVariant(variant);
                }}
                className={`w-4 h-4 rounded-full border-2 ${
                  selectedVariant?.id === variant?.id
                    ? 'border-black ring-2 ring-black'
                    : 'border-gray-300'
                }`}
                style={{
                  backgroundColor:
                    color.toLowerCase() === 'monochrome' ? '#000' : '#e5e5e5',
                }}
              />
            );
          })}
        </div>
      )}

      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-right p-2 rounded z-10">
        <p className="text-sm font-semibold">{product.title}</p>
        <p className="text-xs">${parseFloat(selectedVariant?.price?.amount || 0).toFixed(2)}</p>
      </div>

      {hovered && product.availableForSale && (
        <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center space-x-2 z-10">
          <select
            onChange={(e) =>
              setSelectedVariant(product.variantOptions.find((v) => v.id === e.target.value))
            }
            value={selectedVariant?.id}
            className="bg-white text-black text-xs px-2 py-1 rounded flex-1"
          >
            {product.variantOptions.map((variant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title}
              </option>
            ))}
          </select>

          <button
            onClick={(e) => {
              e.preventDefault();
              handleAddToCart(selectedVariant.id, 1);
            }}
            disabled={loading}
            className="bg-white text-black text-xs font-semibold px-4 py-1 rounded flex-1"
          >
            {loading ? 'Adding…' : 'Add to Cart'}
          </button>
        </div>
      )}

      {hovered && (
        <button
          onClick={(e) => {
            e.preventDefault();
            openQuickView();
          }}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded z-10"
        >
          Quick View
        </button>
      )}
    </div>
  );
};
