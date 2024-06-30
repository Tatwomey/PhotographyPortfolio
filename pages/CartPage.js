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
      <div className="cart-page container mx-auto p-4">
        <h1 className="text-2xl font-semibold mb-4">Your Shopping Cart</h1>
        <div className="cart-items-column mb-8">
          {safeCart.length === 0 ? (
            <p className="text-center">Your cart is empty.</p>
          ) : (
            safeCart.map(({ node: item }, index) => {
              const imageSrc = item.merchandise.product?.images?.edges?.[0]?.node?.src || 'https://via.placeholder.com/50';
              return (
                <div key={item.id} className="cart-item flex items-center border-b pb-4 mb-4">
                  <Image src={imageSrc} alt={item.merchandise.product?.title || 'Product Image'} width={100} height={100} className="mr-4" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.merchandise.product?.title || 'Product Title'}</p>
                    <p>Price: ${item.merchandise.priceV2.amount}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <button className="remove-btn text-red-600 ml-4" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              );
            })
          )}
        </div>
        <div className="cart-summary-column text-center">
          {safeCart.length > 0 && (
            <Link href={globalCart.checkoutUrl} passHref>
              <button className="checkout-button block mb-4" id="checkout" ref={checkoutRef}>Proceed to Checkout</button>
            </Link>
          )}
          {safeCart.length > 0 && (
            <button className="empty-cart-btn bg-red-600 text-white py-2 px-4 rounded" onClick={() => removeFromCart(globalCart.cartId)}>
              Empty Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
