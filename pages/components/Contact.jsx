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
      name: data.get('name'),
      email: data.get('email'),
      subject: data.get('subject'),
      message: data.get('message')
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
        const element = workWithMeRef.current;
        
        const currentScrollPosition = element.getBoundingClientRect().top + window.scrollY;
        const adjustedScrollPosition = currentScrollPosition * 0.30;
        
        window.scroll({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'smooth'
        });
    }
  }, []);

  return (
    <div className='max-w-[1240px] m-auto p-4 h-screen'>
      <h1 id="work-with-me" ref={workWithMeRef} className='text-2xl font-bold text-center p-4'>Work with me</h1>
      
      {isSubmitted ? (
        <div className="text-center text-xl font-bold text-white">
          {"Thank you, I'll be in touch."}
        </div>
      ) : (
        <form className='max-w-[600px] m-auto' onSubmit={handleSubmit}>
          <div className='grid grid-cols-2 gap-2'>
            <input style={{ color: 'black' }} name="name" className='border shadow-lg p-3' type="text" placeholder='Name' />
            <input style={{ color: 'black' }} name="email" className='border shadow-lg p-3' type="email" placeholder='Email' />
          </div>
          <input style={{ color: 'black' }} name="subject" className='border shadow-lg p-3 w-full my-2' type="text" placeholder='Subject' />
          <textarea style={{ color: 'black' }} name="message" className='border shadow-lg p-3 w-full' cols="30" rows="10" placeholder='Message'></textarea>
          <button type="submit" className='border shadow-lg p-3 w-full mt-2'>Submit</button>
        </form>
      )}
    </div>
  )
}

export default Contact;
