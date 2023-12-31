import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Product = ({ product, onAddToCart }) => {
    // Check if the price is available and is a number
    const price = product.price;


    const formattedPrice = price 
        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
        : 'Price Not Available'; 

    const handleAddToCartClick = () => {
        if (onAddToCart) {
            onAddToCart(product);
        }
    };

    return (
        <div className="relative w-full h-96">
            <Link href={`/shop/${product.handle || 'default-slug'}`}>
                <div className="cursor-pointer">
                    <Image
                        src={product.imageSrc || '/fallback-image.jpg'}
                        alt={product.imageAlt || 'Product Image'}
                        width={400}
                        height={400}
                        unoptimized
                    />
                </div>
            </Link>
            <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
            <p className="text-sm">{product.description}</p>
            <p className="font-bold mt-1">{formattedPrice}</p>
            <button 
                onClick={handleAddToCartClick} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            >
                Add to Cart
            </button>
        </div>
    );
};

export default Product;
