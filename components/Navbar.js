import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'transparent',
    color: 'white',
  });

  const router = useRouter();

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 90) {
        setNavbarStyle({ backgroundColor: 'black', color: 'white' });
      } else {
        setNavbarStyle({ backgroundColor: 'transparent', color: 'white' });
      }
    };

    window.addEventListener('scroll', changeColor);
    return () => window.removeEventListener('scroll', changeColor);
  }, []);

  const handleNav = () => setNav(!nav);
  const closeNav = () => setNav(false);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.split('#')[1]; // Get the part after the #
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      router.push(href, undefined, { shallow: true }); // Update URL without full reload
    } else {
      router.push(href); // Normal navigation if no anchor found
    }

    closeNav();
  };

  return (
    <div
      style={{ backgroundColor: nav ? 'black' : navbarStyle.backgroundColor }}
      className='fixed left-0 top-0 w-full z-30 ease-in duration-300'
    >
      <div className='max-w-[1280px] m-auto flex justify-between items-center py-4 px-4'>
        <Link href='/#home' onClick={closeNav}>
          <Image
            src='/waterlogo.PNG'
            alt='Logo'
            width={374}
            height={374}
            className='navbar-logo'
            style={{ cursor: 'pointer' }}
          />
        </Link>
        <div className='hidden md:flex space-x-4 items-center'>
          <a href="/#home" onClick={(e) => handleSmoothScroll(e, '/#home')}>Home</a>
          <a href="/about#about" onClick={(e) => handleSmoothScroll(e, '/about#about')}>About</a>
          <a href="/music#music-photography" onClick={(e) => handleSmoothScroll(e, '/music#music-photography')}>Music</a>
          <a href="/contact#work-with-me" onClick={(e) => handleSmoothScroll(e, '/contact#work-with-me')}>Let’s talk</a>
          <Link href='/shop#shop' onClick={closeNav}>Shop</Link>
          <div className='flex space-x-2'>
            <FaInstagram
              size={20}
              className='cursor-pointer'
              onClick={() => window.open('https://www.instagram.com/trevortwomey/', '_blank', 'noopener,noreferrer')}
            />
            <FaLinkedin
              size={20}
              className='cursor-pointer'
              onClick={() => window.open('https://www.linkedin.com/in/trevor-twomey', '_blank', 'noopener,noreferrer')}
            />
          </div>
        </div>
        <div onClick={handleNav} className='block md:hidden z-10 cursor-pointer'>
          {nav ? (
            <AiOutlineClose size={30} className='text-white' />
          ) : (
            <AiOutlineMenu size={30} className='text-white' />
          )}
        </div>
        <CartIcon />
      </div>
    </div>
  );
};

export default Navbar;
