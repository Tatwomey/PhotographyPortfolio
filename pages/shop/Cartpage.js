import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { CartContext } from '@/contexts/CartContext';
import CartItem from '@/components/CartItem';

const CartPage = () => {
    const { cartItems, removeItemFromCart, cartId } = useContext(CartContext);
    const [loadedCartItems, setLoadedCartItems] = useState([]);

    useEffect(() => {
        const fetchCartItemDetails = async () => {
            if (!cartId) {
                console.error('No cart ID available');
                return;
            }

            try {
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
            } catch (error) {
                console.error('Error fetching cart details:', error);
            }
        };

        if (cartId) {
            fetchCartItemDetails();
        }
    }, [cartId]);

    return (
        <div className="cart-page">
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

export default CartPage;
