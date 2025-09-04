import React, { useRef, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext'; 
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';

const ContactPage = () => {
  const contactRef = useRef(null);
  const { lastNavigatedPage } = useNavigation();

  useEffect(() => {
    if (lastNavigatedPage === '/contact') {
      const element = contactRef.current;
      if (element) {
        window.scroll({
          top: element.getBoundingClientRect().top + window.scrollY,
          behavior: 'smooth',
        });
      }
    }
  }, [lastNavigatedPage]);

  return (
    <div className='flex flex-col min-h-screen'>
      <Hero heading='Contact' message='Submit the form below for more work and quotes.' />
      <div ref={contactRef}>
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;
