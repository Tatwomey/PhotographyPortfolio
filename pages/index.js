import { useState, useEffect } from 'react';
import Head from 'next/head';
import Hero from './components/Hero';
import Instagram from './components/Instagram';
import Slider from './components/Slider';
import { SliderData } from '@/Data/SliderData';

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero-section');

      // If the hero element doesn't exist, do nothing
      if (!heroElement) return;

      const heroHeight = heroElement.offsetHeight;
      const scrollPosition = window.scrollY;
      
      if (scrollPosition > heroHeight) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    };

    // Attach the event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup: remove the event listener
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div style={{ backgroundColor: darkMode ? 'black' : 'initial' }}>
      <Head>
        <title>Trevor Twomey Photography</title>
        <meta name="Trevor Twomey Photography" content="Trevor Twomey Photography" />
      </Head>

      <div id="hero-section">
        <Hero />
      </div>
      
      <Slider slides={SliderData} />
      <Instagram />
    </div>
  );
}
