import React, { useEffect, useState } from 'react';

export default function Cart() {
    const [cart, setCart] = useState({ id: null, lines: [] });
    const [open, setOpen] = useState(false);

    useEffect(() => {
        async function getCart() {
            let localCartData = JSON.parse(
                window.localStorage.getItem('trevortwomeyphoto:shopify:cart')
            );

            if (localCartData) {
                const existingCart = await fetch(
                    `/api/load-cart?cartId=${localCartData.cartId}`
                ).then((res) => res.json());

                setCart({
                    id: localCartData.cartId,
                    checkoutUrl: localCartData.checkoutUrl,
                    estimatedCost: existingCart.cart.estimatedCost,
                    lines: existingCart.cart.lines.edges,
                });

                return;
            }

            localCartData = await fetch('/api/create-cart').then((res) => res.json());

            setCart({
                id: localCartData.cartId,
                checkoutUrl: localCartData.checkoutUrl,
                estimatedCost: null,
                lines: [],
            });

            window.localStorage.setItem(
                'trevortwomeyphoto:shopify:cart',
                JSON.stringify(localCartData)
            );
        }

        getCart();

        const interval = setInterval(() => {
            const state = window.localStorage.getItem('trevortwomeyphoto:shopify:status');

            if (state && state === 'dirty') {
                getCart();
                setOpen(true);
                window.localStorage.setItem('trevortwomeyphoto:shopify:status', 'clean');
            }
        }, 500);

        return () => {
            clearInterval(interval);
        };
    }, []);

    function toggleCart() {
        setOpen(!open);
    }

    function emptyCart() {
        window.localStorage.removeItem('trevortwomeyphoto:shopify:cart');
        // Setting the status to 'dirty' indicates that the cart has been modified.
        // When 'dirty', it will trigger a refresh of the cart data.
        window.localStorage.setItem('trevortwomeyphoto:shopify:status', 'dirty');
    }

    // Adjusted cost calculation, removing the free item logic
    let cost = Number(cart?.estimatedCost?.totalAmount?.amount || 0);

    return (
        <div className="cart">
            <button className="icon" onClick={toggleCart}>
                <img src="/images/cart.svg" alt="cart" />
                <div className="count">{cart.lines.length}</div>
            </button>
            <div className={`drawer ${open ? 'open' : ''}`}>
                <button className="close" onClick={toggleCart}>
                    &times; close
                </button>

                <h3>Your Cart</h3>
                {cart.lines.length > 0 ? (
                    <>
                        <ul>
                            {cart.lines.map(({ node: item }) => (
                                <li key={item.id}>
                                    <p>
                                        {item.quantity} &times;{' '}
                                        {item.merchandise?.product?.title}
                                    </p>
                                </li>
                            ))}
                            <li className="total">
                                <p>Total: {cost === 0 ? 'FREE' : `$${cost}`}</p>
                            </li>
                        </ul>
                        <a className="button" href={`${cart.checkoutUrl}?discount=CYBERMON`}>
                            Check Out
                        </a>
                        <button className="empty-cart" onClick={emptyCart}>
                            empty cart
                        </button>
                    </>
                ) : (
                    <p className="no-items">your cart is empty</p>
                )}
            </div>
        </div>
    );
}
