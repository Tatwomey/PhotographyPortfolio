import React from 'react';
import { useShopContext } from '@/contexts/shopContext';
import Image from 'next/image';

const CartDrawer = () => {
  const { globalCart, removeFromCart, cartOpen, setCartOpen } = useShopContext();
  const safeCart = globalCart.lines ? globalCart.lines.edges : [];

  const handleClose = () => setCartOpen(false);

  return (
    <div className={`cart-drawer ${cartOpen ? 'open' : ''}`}>
      <div className="cart-header flex justify-between items-center border-b pb-2 mb-4">
        <h3 className="text-xl font-semibold">Your Cart</h3>
        <button className="close text-xl" onClick={handleClose}>✕</button>
      </div>
      {safeCart.length === 0 ? (
        <p className="no-items text-center">Your cart is empty.</p>
      ) : (
        <>
          <ul className="cart-items space-y-4">
            {safeCart.map(({ node: item }, index) => {
              const imageSrc = item.merchandise.product?.images?.edges?.[0]?.node?.src || 'https://via.placeholder.com/50';
              return (
                <li key={item.id} className="cart-item flex items-center space-x-4 border-b pb-2">
                  <Image src={imageSrc} alt={item.merchandise.product?.title || 'Product Image'} width={50} height={50} />
                  <div className="flex-1">
                    <p className="item-title font-semibold">{item.merchandise.product?.title || 'Product Title'}</p>
                    <p className="item-price text-sm">Price: ${item.merchandise.priceV2.amount}</p>
                    <p className="item-quantity text-sm">Quantity: {item.quantity}</p>
                  </div>
                  <button className="remove-btn text-red-600" onClick={() => removeFromCart(item.id)}>Remove</button>
                </li>
              );
            })}
          </ul>
          <a className="button checkout-button mt-4 block text-center" href={globalCart.checkoutUrl}>Proceed to Checkout</a>
        </>
      )}
    </div>
  );
};

export default CartDrawer;
