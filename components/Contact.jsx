import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Contact = () => {
    const workWithMeRef = useRef(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [purpose, setPurpose] = useState([]);

    const handlePurposeChange = (event) => {
        const value = event.target.value;
        setPurpose((prevPurpose) =>
            prevPurpose.includes(value)
                ? prevPurpose.filter((purpose) => purpose !== value)
                : [...prevPurpose, value]
        );
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.target;
        const data = new FormData(form);
        const payload = {
            firstName: data.get('firstName'),
            lastName: data.get('lastName'),
            email: data.get('email'),
            subject: data.get('subject'),
            message: data.get('message'),
            purpose: purpose
        };

        // Check for the required fields including the purpose checkboxes
        if (
            !payload.firstName ||
            !payload.lastName ||
            !payload.email ||
            !payload.message ||
            purpose.length === 0
        ) {
            alert('Please fill in all required fields.');
            return;
        }

        const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
        if (!emailRegex.test(payload.email)) {
            alert('Please enter a valid email address.');
            return;
        }

        try {
            const response = await axios.post('/api/send', payload);
            if (response.data.error) {
                alert('Error sending email: ' + response.data.error.message);
            } else {
                setIsSubmitted(true);
            }
        } catch (error) {
            console.error(
                'Failed to send the email:',
                error.response ? error.response.data : error.message
            );
            alert('Failed to send the email. Please try again later.');
        }
    };

    useEffect(() => {
        if (window.location.hash === '#work-with-me' && workWithMeRef.current) {
            workWithMeRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    return isSubmitted ? (
        <div className='max-w-[1240px] m-auto p-4 min-h-screen flex justify-center items-center'>
            <h1 className='text-2xl font-bold text-white'>
            Thank you, I&apos;ll be in touch soon.
            </h1>
        </div>
    ) : (
        <div className='max-w-[1240px] m-auto p-4 min-h-screen pb-20'>
            <h1 id='work-with-me' ref={workWithMeRef} className='text-2xl font-bold text-center p-4'>
                Work with me
            </h1>
            <form className='max-w-[600px] m-auto' onSubmit={handleSubmit}>
                {/* Purpose of email checkboxes */}
                <div className='flex flex-col items-center mb-4'>
                    <label className='text-lg mb-2'>Purpose of email (required)</label>
                    <div className='flex space-x-4'>
                        <div>
                            <input
                                type='checkbox'
                                name='purpose'
                                value='Business Inquiries'
                                onChange={handlePurposeChange}
                            />
                            <span className='ml-2 text-gray-500'>Business Inquiries</span>
                        </div>
                        <div>
                            <input
                                type='checkbox'
                                name='purpose'
                                value='Print Inquiries'
                                onChange={handlePurposeChange}
                            />
                            <span className='ml-2 text-gray-500'>Print Inquiries</span>
                        </div>
                    </div>
                </div>

                {/* Name input fields */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
                        <input
                            style={{ color: 'black' }}
                            name='firstName'
                            className='border shadow-lg p-3 w-full'
                            type='text'
                            placeholder='First Name'
                            required
                        />
                        <div className='text-sm text-gray-500'>Required</div>
                    </div>
                    <div>
                        <input
                            style={{ color: 'black' }}
                            name='lastName'
                            className='border shadow-lg p-3 w-full'
                            type='text'
                            placeholder='Last Name'
                            required
                        />
                        <div className='text-sm text-gray-500'>Required</div>
                    </div>
                </div>

                {/* Email and Subject fields */}
                <div>
                    <input
                        style={{ color: 'black' }}
                        name='email'
                        className='border shadow-lg p-3 w-full my-2'
                        type='email'
                        placeholder='Email'
                        required
                    />
                    <div className='text-sm text-gray-500'>Required</div>
                </div>
                <input
                    style={{ color: 'black' }}
                    name='subject'
                    className='border shadow-lg p-3 w-full my-2'
                    type='text'
                    placeholder='Subject'
                />

                {/* Message textarea */}
                <textarea
                    style={{ color: 'black' }}
                    name='message'
                    className='border shadow-lg p-3 w-full'
                    cols='30'
                    rows='10'
                    placeholder='Message'
                    required
                ></textarea>
                <div className='text-sm text-gray-500 mb-2'>Required</div>

                {/* Submit button */}
                <button type='submit' className='border shadow-lg p-3 w-full mt-2'>
                    Submit
                </button>
            </form>
        </div>
    );
};

export default Contact;
