import React from 'react';
import { useShopContext } from '../contexts/shopContext';
import CartItem from './CartItem'; // You should import the CartItem component if it's not already imported

const CartDrawer = () => {
  const { cart, removeFromCart } = useShopContext();

  return (
    <div className="cart-drawer">
      {cart && cart.lines && cart.lines.edges && cart.lines.edges.length > 0 ? (
        cart.lines.edges.map((item) => (
          <CartItem
            key={item.node.id}
            item={{
              id: item.node.id,
              name: item.node.merchandise.product.title,
              price: item.node.merchandise.price,
              image: item.node.merchandise.product.images.edges[0]?.node.url,
              quantity: item.node.quantity,
            }}
            onRemove={() => removeFromCart(item.node.id)}
          />
        ))
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
};

export default CartDrawer;

