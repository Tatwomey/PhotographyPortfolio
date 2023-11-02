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
      message: data.get('message')
    };

    try {
      const res = await axios.post('/api/send', payload);
      console.log('Email sent successfully:', res.data);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Failed to send the email:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    if (window.location.hash === '#work-with-me' && workWithMeRef.current) {
      const element = workWithMeRef.current;
      window.scroll({
        top: element.getBoundingClientRect().top + window.scrollY,
        behavior: 'smooth',
      });
    }
  }, []);

  return (
    <div className='max-w-[1240px] m-auto p-4 h-screen pb-20'> 
      <h1 id="work-with-me" ref={workWithMeRef} className='text-2xl font-bold text-center p-4'>Work with me</h1>
      
      <div className="flex flex-col items-center mb-4">
        <label className="text-lg mb-2">Purpose of email (required)</label>
        <div className="flex space-x-4">
          <div>
            <input type="checkbox" name="purpose" value="Business Inquiries" />
            <span className="text-gray-500">Business Inquiries</span>
          </div>
          <div>
            <input type="checkbox" name="purpose" value="Print Inquiries" />
            <span className="text-gray-500">Print Inquiries</span>
          </div>
        </div>
      </div>

      {isSubmitted ? (
        <div className="text-center text-xl font-bold text-white">
          {"Thank you, I'll be in touch."}
        </div>
      ) : (
        <form className='max-w-[600px] m-auto' onSubmit={handleSubmit}>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <input style={{ color: 'black' }} name="firstName" className='border shadow-lg p-3 w-full' type="text" placeholder='First Name' required />
              <div className="text-sm text-gray-500">Required</div>
            </div>
            <div>
              <input style={{ color: 'black' }} name="lastName" className='border shadow-lg p-3 w-full' type="text" placeholder='Last Name' required />
              <div className="text-sm text-gray-500">Required</div>
            </div>
          </div>
          <div>
            <input style={{ color: 'black' }} name="email" className='border shadow-lg p-3 w-full my-2' type="email" placeholder='Email' required />
            <div className="text-sm text-gray-500">Required</div>
          </div>
          <input style={{ color: 'black' }} name="subject" className='border shadow-lg p-3 w-full my-2' type="text" placeholder='Subject' />
          <textarea style={{ color: 'black' }} name="message" className='border shadow-lg p-3 w-full' cols="30" rows="10" placeholder='Message' required></textarea>
          <div className="text-sm text-gray-500 mb-2">Required</div>
          <button type="submit" className='border shadow-lg p-3 w-full mt-2'>Submit</button>
        </form>
      )}
    </div>
  );
}

export default Contact;
