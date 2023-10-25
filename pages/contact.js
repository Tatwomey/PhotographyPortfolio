import React, { useRef, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationContext'; // update the path based on your folder structure
import Contact from './components/Contact';
import Hero from './components/Hero';

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
    <div>
      <Hero heading='Contact' message='Submit the form below for more work and quotes.' />
      <div ref={contactRef}>
        <Contact />
      </div>
    </div>
  );
};

export default ContactPage;
