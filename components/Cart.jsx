import React, { useEffect, useState } from 'react';
import { useShopContext } from '@/contexts/shopContext';
import Image from 'next/image';

export default function Cart() {
  const { cart, handleRemoveFromCart, refreshCart } = useShopContext();
  const [localCart, setLocalCart] = useState(cart || { id: null, lines: [], checkoutUrl: '', estimatedCost: null });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (cart) {
      setLocalCart(cart);
    }
  }, [cart]);

  useEffect(() => {
    const fetchCart = async () => {
      await refreshCart();
    };

    // Only fetch the cart if it hasn't been fetched yet
    if (!cart || !cart.id) {
      fetchCart();
    }
  }, [refreshCart, cart]);

  function toggleCart() {
    setOpen(!open);
  }

  function emptyCart() {
    window.localStorage.removeItem('shopify_cart_id');
    setLocalCart({ id: null, lines: [], checkoutUrl: '', estimatedCost: null });
    refreshCart();
  }

  return (
    <div className="cart">
      <button className="icon" onClick={toggleCart}>
        <Image src="/images/cart.svg" alt="cart" width={20} height={20} />
        <div className="count">{localCart && localCart.lines ? localCart.lines.length : 0}</div>
      </button>
      <div className={`drawer ${open ? 'open' : ''}`}>
        <button className="close" onClick={toggleCart}>
          &times; Close
        </button>
        <h3>Your Cart</h3>
        {localCart && localCart.lines && localCart.lines.length > 0 ? (
          <>
            <ul>
              {localCart.lines.map(({ node: item }, index) => (
                <li key={index} className="cart-item flex items-center border-b pb-4 mb-4">
                  <Image
                    src={item.merchandise.product.images.edges[0].node.url}
                    alt={item.merchandise.product.title}
                    width={50}
                    height={50}
                    style={{ marginRight: '10px' }}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{item.merchandise.product.title}</p>
                    <p>Price: ${item.merchandise.priceV2.amount}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>
                  <button className="remove-btn text-red-600 ml-4" onClick={() => handleRemoveFromCart(item.id)}>Remove</button>
                </li>
              ))}
            </ul>
            <a className="button" href={localCart.checkoutUrl}>Check Out</a>
            <button className="empty-cart" onClick={emptyCart}>Empty Cart</button>
          </>
        ) : (
          <p className="no-items">Your cart is empty.</p>
        )}
      </div>
    </div>
  );
}
