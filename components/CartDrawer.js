import React from 'react';
import { useShopContext } from '@/contexts/shopContext';
import Image from 'next/image';

const CartDrawer = () => {
  const { globalCart, removeFromCart, cartOpen, setCartOpen } = useShopContext();
  const safeCart = globalCart.lines ? globalCart.lines.edges : [];

  const handleClose = () => setCartOpen(false);

  return (
    <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
      <div className="cart-header">
        <h3>Your Cart</h3>
        <button className="close" onClick={handleClose}>
          &times; Close
        </button>
      </div>
      {safeCart.length === 0 ? (
        <p className="no-items">Your cart is empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {safeCart.map(({ node: item }, index) => {
              const imageSrc = item.merchandise.product?.images?.edges?.[0]?.node?.src || 'https://via.placeholder.com/40';
              return (
                <div key={item.id} className="cart-item flex items-center border-b pb-4 mb-4">
                  <Image src={imageSrc} alt={item.merchandise.product?.title || 'Product Image'} width={50} height={50} className="mr-4" />
                  <div className="flex-1">
                    <p className="font-semibold">{item.merchandise.product?.title || 'Product Title'}</p>
                    <p>Price: ${item.merchandise.priceV2.amount}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <button className="remove-btn text-red-600 ml-4" onClick={() => removeFromCart(item.id)}>Remove</button>
                </div>
              );
            })}
          </div>
          <a className="checkout-button" href={globalCart.checkoutUrl}>Proceed to Checkout</a>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
