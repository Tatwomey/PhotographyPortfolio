import React, { useContext, useEffect, useState } from 'react';
import { CartContext } from '@/contexts/CartContext';
import CartItem from './CartItem';
import { loadCart } from '@/utils/load-cart'; // Ensure this path is correct

const CartDrawer = () => {
    const { removeItemFromCart, cartId } = useContext(CartContext);
    const [loadedCartItems, setLoadedCartItems] = useState([]);

    useEffect(() => {
        const fetchCartDetails = async () => {
            if (cartId) {
                const cartData = await loadCart(cartId);
                if (cartData && cartData.lines) {
                    setLoadedCartItems(cartData.lines.edges.map(edge => ({
                        id: edge.node.id,
                        name: edge.node.merchandise.product.title,
                        price: edge.node.merchandise.price.amount,
                        image: edge.node.merchandise.product.images.edges[0].node.src,
                        quantity: edge.node.quantity,
                    })));
                }
            }
        };

        fetchCartDetails();
    }, [cartId]);

    return (
        <div className="cart-drawer">
            {loadedCartItems.length > 0 ? (
                loadedCartItems.map(item => (
                    <CartItem key={item.id} item={item} onRemove={removeItemFromCart} />
                ))
            ) : (
                <p>Your cart is empty.</p>
            )}
        </div>
    );
};

export default CartDrawer;
