import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const Contact = () => {
  const workWithMeRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const data = new FormData(form);
    const payload = {
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message'),
      phoneNumber: data.get('phoneNumber'),
      purpose: data.get('purpose')
    };

    try {
      const res = await axios.post('/api/sendEmail', payload);
      console.log('Email sent successfully:', res.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send the email:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (window.location.hash === '#work-with-me' && workWithMeRef.current) {
      window.scroll({
        top: workWithMeRef.current.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth'
      });
    }
  }, []);

  return (
    <div className='max-w-[1240px] m-auto p-4 h-screen'>
      <h1 id="work-with-me" ref={workWithMeRef} className='text-2xl font-bold text-center p-4'>Work with me</h1>
      <div className="text-sm text-gray-500 mb-4 text-center">Purpose of email (required)</div>
      <div className="flex justify-center space-x-4 mb-4">
        <label>
          <input type="radio" name="purpose" value="Business Inquiries" required /> Business Inquiries
        </label>
        <label>
          <input type="radio" name="purpose" value="Print Inquiries" required /> Print Inquiries
        </label>
      </div>
      {isSubmitted ? (
        <div className="text-center text-xl font-bold text-white">
          {"Thank you, I'll be in touch."}
        </div>
      ) : (
        <form className='max-w-[600px] m-auto' onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-2'>
            <div>
              <input style={{ color: 'black' }} name="firstName" className='border shadow-lg p-3' type="text" placeholder='First Name' required />
              <div className="text-sm text-gray-500">Required</div>
            </div>
            <div>
              <input style={{ color: 'black' }} name="lastName" className='border shadow-lg p-3' type="text" placeholder='Last Name' required />
              <div className="text-sm text-gray-500">Required</div>
            </div>
          </div>
          <div>
            <input style={{ color: 'black' }} name="email" className='border shadow-lg p-3 w-full my-2' type="email" placeholder='Email' required />
            <div className="text-sm text-gray-500">Required</div>
          </div>
          <div>
            <input style={{ color: 'black' }} name="phoneNumber" className='border shadow-lg p-3 w-full my-2' type="tel" placeholder='Phone Number (Optional)' />
          </div>
          <div>
            <textarea style={{ color: 'black' }} name="message" className='border shadow-lg p-3 w-full' cols="30" rows="10" placeholder='Message' required></textarea>
            <div className="text-sm text-gray-500">Required</div>
          </div>
          <button type="submit" className='border shadow-lg p-3 w-full mt-2'>Submit</button>
        </form>
      )}
    </div>
  );
}

export default Contact;
