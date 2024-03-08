import React, { useState } from 'react';

const CheckoutForm = ({ onSubmit, cartItems }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCustomerInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const processedCartItems = cartItems.map(({ variantId, quantity }) => ({
            variantId,
            quantity: parseInt(quantity, 10)
        }));
        onSubmit(customerInfo, processedCartItems);
    };

    return (
        <form className="max-w-[600px] m-auto" onSubmit={handleSubmit} noValidate>
            {Object.entries(customerInfo).map(([key, value]) => (
                <div key={key} className="mb-4">
                    <label htmlFor={key} className="block mb-2 capitalize">{key}</label>
                    <input
                        type={key === 'email' ? 'email' : 'text'}
                        id={key}
                        name={key}
                        value={value}
                        onChange={handleChange}
                        required
                        className="border shadow-lg p-3 w-full"
                        style={{ color: 'black' }}
                        autoComplete="off"
                    />
                </div>
            ))}
            <button type="submit" className="bg-blue-500 text-white p-3 rounded">
                Complete Checkout
            </button>
        </form>
    );
};

export default CheckoutForm;
