import React, { useState } from 'react';

const CheckoutForm = ({ onSubmit, cartItems }) => {
    const [customerInfo, setCustomerInfo] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        country: '',
    });

    const handleChange = (e) => {
        setCustomerInfo({
            ...customerInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Process cartItems correctly before sending
        const processedCartItems = cartItems.map(item => ({
            variantId: item.variantId,
            quantity: parseInt(item.quantity, 10)
        }));
        onSubmit(customerInfo, processedCartItems);
    };

    return (
        <form className='max-w-[600px] m-auto' onSubmit={handleSubmit}>
            <div className='mb-4'>
                <label htmlFor="name" className='block mb-2'>Name</label>
                <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={customerInfo.name} 
                    onChange={handleChange} 
                    required 
                    className='border shadow-lg p-3 w-full'
                />
            </div>
            <div className='mb-4'>
                <label htmlFor="email" className='block mb-2'>Email</label>
                <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={customerInfo.email} 
                    onChange={handleChange} 
                    required 
                    className='border shadow-lg p-3 w-full'
                />
            </div>
            <div className='mb-4'>
                <label htmlFor="address" className='block mb-2'>Address</label>
                <input 
                    type="text" 
                    id="address" 
                    name="address" 
                    value={customerInfo.address} 
                    onChange={handleChange} 
                    required 
                    className='border shadow-lg p-3 w-full'
                />
            </div>
            <div className='mb-4'>
                <label htmlFor="city" className='block mb-2'>City</label>
                <input 
                    type="text" 
                    id="city" 
                    name="city" 
                    value={customerInfo.city} 
                    onChange={handleChange} 
                    required 
                    className='border shadow-lg p-3 w-full'
                />
            </div>
            <div className='mb-4'>
                <label htmlFor="country" className='block mb-2'>Country</label>
                <input 
                    type="text" 
                    id="country" 
                    name="country" 
                    value={customerInfo.country} 
                    onChange={handleChange} 
                    required 
                    className='border shadow-lg p-3 w-full'
                />
            </div>
            <button type="submit" className="bg-blue-500 text-white p-3 rounded">
                Complete Checkout
            </button>
        </form>
    );
};

export default CheckoutForm;
