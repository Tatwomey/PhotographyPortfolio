// components/CartItem.js
import React from 'react';

const CartItem = ({ item, onRemove }) => {
    return (
        <div className="cart-item">
            <div className="item-details">
                <span className="item-name">{item.name}</span> {/* Replace with your item property */}
                <span className="item-price">${item.price}</span> {/* Replace with your item property */}
            </div>
            <div className="item-actions">
                <button onClick={() => onRemove(item.id)}>Remove</button>
            </div>
        </div>
    );
};

export default CartItem;
