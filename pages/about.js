import React, { useRef, useEffect } from 'react';
import About from '@/components/About';
import { useSmoothScroll } from '@/hooks/useSmoothScroll';
import Hero from '@/components/Hero';
import { useNavigation } from '../contexts/NavigationContext'; // Update this path if necessary

export default function AboutPage() {
  const aboutRef = useRef(null);

  // Get the last navigated page from the context
  const { lastNavigatedPage } = useNavigation();

  // Applying smooth scroll to the about section
  useSmoothScroll('#about-trevor-twomey', aboutRef);

  // If the last navigated page was "/about", scroll to the about section
  useEffect(() => {
    if (lastNavigatedPage === '/about') {
      const element = aboutRef.current;
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
      <Hero heading='About' message='Learn more about Trevor Twomey.' />
      <div ref={aboutRef}>
        <About />
      </div>
    </div>
  );
}
