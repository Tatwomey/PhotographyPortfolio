import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Product = ({ product, isSoldOut }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative w-full bg-white group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        href={`/shop/${product.handle}`}
        className="block aspect-[4/5] w-full overflow-hidden relative"
      >
        <Image
          src={hovered && product.altImageSrc ? product.altImageSrc : product.imageSrc}
          alt={product.imageAlt || product.title}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover rounded-md transition duration-300 ease-in-out"
          unoptimized
        />
      </Link>

      {/* Sold Out Badge */}
      {isSoldOut && (
        <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded z-10">
          Sold out
        </div>
      )}

      {/* Title, Price */}
      <div className="text-center mt-3">
        <h3 className="text-sm font-semibold">{product.title}</h3>
        <p className="text-xs text-gray-600">{product.description}</p>
        <p className="text-sm font-bold mt-1">${parseFloat(product.price).toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Product;
