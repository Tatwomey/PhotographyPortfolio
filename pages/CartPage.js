import React, { useRef } from 'react';
import { useShopContext } from '@/contexts/shopContext';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Hero from '@/components/Hero';
import Image from 'next/image';
import Link from 'next/link';

const CartPage = () => {
  const { globalCart, removeFromCart } = useShopContext();
  const safeCart = globalCart.lines ? globalCart.lines.edges : [];
  const checkoutRef = useRef(null);

  useSmoothScroll('#checkout', checkoutRef);

  return (
    <div>
      <Hero />
      <div className="container mx-auto mt-10">
        <div className="sm:flex shadow-md my-10">
          <div className="w-full bg-white px-10 py-10">
            <div className="flex justify-between border-b pb-8">
              <h1 className="font-semibold text-2xl text-black">Shopping Cart</h1>
              <h2 className="font-semibold text-2xl text-color-brown">{safeCart.length} Items</h2>
            </div>
            {safeCart.length === 0 ? (
              <p className="text-center text-color-brown">Your cart is empty.</p>
            ) : (
              safeCart.map(({ node: item }) => {
                const merchandise = item.merchandise;
                const product = merchandise.product;
                const imageSrc = product.images?.edges?.[0]?.node?.url || 'https://via.placeholder.com/50';
                const priceAmount = parseFloat(merchandise.priceV2.amount);
                return (
                  <div key={item.id} className="md:flex items-stretch py-8 md:py-10 lg:py-8 border-t border-gray-50">
                    <div className="md:w-4/12 2xl:w-1/4 w-full">
                      <Image src={imageSrc} alt={product.title || 'Product Image'} className="h-full object-center object-cover md:block hidden" width={100} height={100} />
                      <Image src={imageSrc} alt={product.title || 'Product Image'} className="md:hidden w-full h-full object-center object-cover" width={100} height={100} />
                    </div>
                    <div className="md:pl-3 md:w-8/12 2xl:w-3/4 flex flex-col justify-center">
                      <p className="text-xs leading-3 text-gray-800 md:pt-0 pt-4">{merchandise.sku}</p>
                      <div className="flex items-center justify-between w-full">
                        <p className="text-base font-black leading-none text-black">{product.title}</p>
                        <select aria-label="Select quantity" className="py-2 px-1 border border-gray-200 mr-6 focus:outline-none text-black">
                          {[...Array(10).keys()].map((num) => (
                            <option key={num} value={num + 1}>{num + 1}</option>
                          ))}
                        </select>
                      </div>
                      <p className="text-xs leading-3 text-gray-600 pt-2">Price: ${priceAmount.toFixed(2)} {merchandise.priceV2.currencyCode}</p>
                      <p className="text-xs leading-3 text-gray-600 py-4">Quantity: {item.quantity}</p>
                      <div className="flex items-center justify-between pt-5">
                        <div className="flex items-center">
                          <p className="text-xs leading-3 underline text-gray-800 cursor-pointer">Add to favorites</p>
                          <p className="text-xs leading-3 underline text-red-500 pl-5 cursor-pointer" onClick={() => removeFromCart(item.id)}>Remove</p>
                        </div>
                        <p className="text-base font-black leading-none text-color-brown">${(priceAmount * item.quantity).toFixed(2)} {merchandise.priceV2.currencyCode}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
            <div className="flex justify-between">
              {globalCart.checkoutUrl && (
                <Link href={globalCart.checkoutUrl} passHref>
                  <button className="checkout-button block mb-4" id="checkout" ref={checkoutRef}>Checkout Now</button>
                </Link>
              )}
              <Link href="/shop#shop" passHref>
                <button className="continue-shopping-btn block mb-4">Keep Shopping</button>
              </Link>
            </div>
            <div className="text-center mt-4">
              <p className="text-red-500">* free shipping on all orders over $250, some exceptions may apply</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg">Subtotal: ${safeCart.reduce((total, { node: item }) => total + parseFloat(item.merchandise.priceV2.amount) * item.quantity, 0).toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
