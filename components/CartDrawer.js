import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '@/contexts/CartContext';
import CartItem from './CartItem';

const CartDrawer = () => {
    const { cartItems, removeItemFromCart, cartId } = useContext(CartContext); // Include cartId here
    const [loadedCartItems, setLoadedCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItemDetails = async () => {
            if (!cartId) {
                console.error('No cart ID available');
                return;
            }

            const response = await axios.post('/api/shopify-get-cart', { cartId });
            if (response.data && response.data.cart) {
                setLoadedCartItems(response.data.cart.lines.edges.map(line => ({
                    id: line.node.id,
                    name: line.node.merchandise.product.title,
                    price: line.node.merchandise.price.amount,
                    image: line.node.merchandise.product.images.edges[0].node.src,
                    quantity: line.node.quantity,
                })));
            }
        };

        if (cartItems.length > 0 && cartId) {
            fetchCartItemDetails();
        }
    }, [cartItems, cartId]); // cartId is now included in the dependency array
    
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
