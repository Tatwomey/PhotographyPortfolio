// components/ProductSlugLayout.jsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import Hero from '@/components/Hero';
import TabSection from '@/components/TabSection';

export default function ProductSlugLayout({ product }) {
  const { handleAddToCart } = useShopContext();
  const router = useRouter();

  if (!product || !product.variants) {
    return <div className="text-center py-20 text-lg">Loading product...</div>;
  }

  const colorOptions = Array.from(
    new Set(
      product.variants
        .map((v) =>
          v.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color')?.value
        )
        .filter(Boolean)
    )
  );

  const defaultVariant =
    product.variants.find((v) =>
      v.selectedOptions.some(
        (opt) => opt.name.toLowerCase() === 'color' && opt.value.toLowerCase() === 'regular'
      )
    ) || product.variants[0];

  const [selectedColor, setSelectedColor] = useState(
    defaultVariant.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color')?.value
  );
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [mainImage, setMainImage] = useState(defaultVariant.image?.src || product.images[0]?.src);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  const variantsForColor = product.variants.filter((v) =>
    v.selectedOptions.some(
      (opt) => opt.name.toLowerCase() === 'color' && opt.value === selectedColor
    )
  );

  useEffect(() => {
    const variant = variantsForColor[0];
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.images[0]?.src);
      setCurrentImageIdx(0);
    }
  }, [selectedColor]);

  const handleVariantChange = (e) => {
    const variant = product.variants.find((v) => v.id === e.target.value);
    if (variant) {
      setSelectedVariant(variant);
      setMainImage(variant.image?.src || product.images[0]?.src);

      const newColor = variant.selectedOptions.find((opt) => opt.name.toLowerCase() === 'color');
      if (newColor?.value) {
        setSelectedColor(newColor.value);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart(selectedVariant.id, 1);
    router.push('/checkout');
  };

  const handleNotifyClick = () => {
    if (window._klOnsite) {
      window._klOnsite.push(['openForm', 'RjNi3C']);
    }
  };

  return (
    <>
      <Hero />
      <main className="bg-white text-black px-4 py-12 container mx-auto">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Left: Image */}
          <div className="w-full lg:max-w-[550px]">
            <div className="relative aspect-[4/5] bg-gray-100 rounded overflow-hidden shadow group">
              <Image
                src={mainImage}
                alt={product.title}
                layout="fill"
                objectFit="cover"
                className="rounded transition-transform duration-300 ease-in-out group-hover:scale-105"
              />
              {!selectedVariant.availableForSale && (
                <div className="absolute top-0 left-0 bg-red-600 text-white text-sm font-bold px-3 py-1">
                  Sold Out
                </div>
              )}
            </div>

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
                      currentImageIdx === idx ? 'border-black' : 'border-gray-300'
                    }`}
                  >
                    <Image src={img.src} alt={`Thumb ${idx}`} width={80} height={100} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="w-full lg:max-w-md">
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            {product.description && (
              <p className="text-sm italic text-gray-600 mb-4">{product.description}</p>
            )}
            <p className="text-xl font-semibold mb-4">
              ${parseFloat(selectedVariant?.priceV2?.amount || 0).toFixed(2)}
            </p>

            {/* Low Inventory Notice */}
            {selectedVariant.quantityAvailable <= 3 && selectedVariant.quantityAvailable > 0 && (
              <p className="text-sm text-red-600 font-semibold mt-1">
                Only {selectedVariant.quantityAvailable} left in stock!
              </p>
            )}

            {/* Swatches */}
            {colorOptions.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Color</label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        selectedColor === color
                          ? 'border-black ring-2 ring-black'
                          : 'border-gray-300'
                      }`}
                      style={{
                        backgroundColor:
                          color.toLowerCase() === 'monochrome' ? '#000' : '#e5e5e5',
                      }}
                      aria-label={color}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Edition / Size */}
            {variantsForColor.length > 1 && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Edition / Size</label>
                <select
                  value={selectedVariant.id}
                  onChange={handleVariantChange}
                  className="w-full border rounded p-2"
                >
                  {variantsForColor.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* CTA Buttons */}
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

            {/* Tabs Component */}
            <TabSection details={product.description} />
          </div>
        </div>
      </main>
    </>
  );
}
