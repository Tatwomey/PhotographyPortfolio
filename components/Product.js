import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShopContext } from '@/contexts/shopContext';

const Product = ({ product, isSoldOut, onAddToCart }) => {
  const { cart, handleAddToCart, refreshCart } = useShopContext();
  const [addingToCart, setAddingToCart] = React.useState(false);

  React.useEffect(() => {
    refreshCart(); // Ensure cart is refreshed on component mount
  }, [refreshCart]);

  const price = product.price;

  const formattedPrice = price
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price)
    : 'Price Not Available';

  const handleAddToCartClick = async () => {
    if (!cart) {
      console.error('Cart is still loading or not available. Please wait.');
      return;
    }

    setAddingToCart(true);
    try {
      await handleAddToCart(product.variantId, 1);
      alert('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
    setAddingToCart(false);
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
            priority={true} // Adding the priority property
            unoptimized
          />
          {isSoldOut && (
            <div className="absolute top-0 left-0 bg-red-500 text-white p-2">
              Sold out
            </div>
          )}
        </div>
      </Link>
      <h2 className="text-xl font-semibold mt-2">{product.title}</h2>
      <p className="text-sm">{product.description}</p>
      <p className="font-bold mt-1">{formattedPrice}</p>
      <button
        onClick={handleAddToCartClick}
        className={`product-btn ${isSoldOut ? 'sold-out-btn' : 'add-to-cart-btn'}`}
        disabled={addingToCart || isSoldOut}
      >
        {addingToCart ? 'Adding...' : isSoldOut ? 'Sold Out' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Product;