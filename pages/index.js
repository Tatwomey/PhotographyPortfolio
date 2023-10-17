import { useState, useEffect } from 'react';
import Head from 'next/head';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './About';
import Instagram from './components/Instagram';
import Slider from './components/Slider';
import { SliderData } from '@/Data/SliderData';

export default function Home() {



  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroElement = document.getElementById('hero-section');
      if (!heroElement) return;
      const heroHeight = heroElement.offsetHeight;
      const scrollPosition = window.scrollY;
      if (scrollPosition > heroHeight) {
        setDarkMode(true);
      } else {
        setDarkMode(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
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
  
<div id="about-trevor-twomey" className="pt-20">
    <About />
</div>

      )

      <Instagram />
    </div>
  );
}
