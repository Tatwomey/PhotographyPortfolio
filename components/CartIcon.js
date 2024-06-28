import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useShopContext } from '@/contexts/shopContext';
import CartDrawer from './CartDrawer';

const CartIcon = () => {
    const router = useRouter();
    const { globalCart, cartOpen, setCartOpen } = useShopContext();

    const itemCount = globalCart.items ? globalCart.items.reduce((total, item) => total + item.quantity, 0) : 0;

    const handleHover = () => {
        setCartOpen(!cartOpen);
    };

    const handleClick = () => {
        router.push('/CartPage');
    };

    return (
        <div className="cart-icon-link" onMouseEnter={handleHover} onMouseLeave={handleHover} onClick={handleClick}>
            <FaShoppingCart />
            {itemCount > 0 && <span className="cart-icon-badge">{itemCount}</span>}
            {cartOpen && <CartDrawer />}
        </div>
    );
};

export default CartIcon;
