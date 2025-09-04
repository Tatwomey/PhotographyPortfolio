'use client';
import { useEffect } from 'react';
import ProductSlugLayout from './ProductSlugLayout';

export default function ProductWithScroll({ product }) {
  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 20;

    const extractHash = () => {
      const url = window.location.href;
      const hash = url.includes('#') ? url.split('#')[1] : '';
      console.log('⏳ Extracted hash from href:', hash);
      return hash;
    };

    const checkHashAndScroll = () => {
      const hash = extractHash();

      if (hash === 'product-details') {
        const el = document.getElementById('product-details');
        if (el) {
          console.log('✅ Element found — scrolling to #product-details');
          el.scrollIntoView({ behavior: 'smooth' });
        } else if (attempts < maxAttempts) {
          attempts++;
          console.log(`⚠️ Retry ${attempts}: element not found`);
          setTimeout(checkHashAndScroll, 100);
        } else {
          console.log('❌ Max retries reached — could not scroll');
        }
      } else {
        console.log('❌ Hash not matched — skipping scroll');
      }
    };

    setTimeout(checkHashAndScroll, 100);
  }, []);

  return <ProductSlugLayout product={product} />;
}
