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
    if (typeof window !== 'undefined') {
      const changeColor = () => {
        if (window.scrollY >= 90) {
          setNavbarStyle({ backgroundColor: 'black', color: 'white' });
        } else {
          setNavbarStyle({ backgroundColor: 'transparent', color: 'white' });
        }
      };

      window.addEventListener('scroll', changeColor);
      return () => window.removeEventListener('scroll', changeColor);
    }
  }, []);

  const handleNav = () => setNav(!nav);
  const closeNav = () => setNav(false);

  const handleSmoothScroll = (e, href) => {
    e.preventDefault();
    const targetId = href.split('#')[1]; // Extract section ID
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
      if (router.pathname !== href.split('#')[0]) {
        router.push(href);
      }
    } else {
      router.push(href);
    }
    closeNav();
  };

  return (
    <div
      style={{ backgroundColor: nav ? 'black' : navbarStyle.backgroundColor }}
      className='fixed left-0 top-0 w-full z-30 ease-in duration-300'
    >
      <div className='max-w-[1280px] m-auto flex justify-between items-center py-4 px-4'>
        <Link href='/#home'>
          <Image
            src='/waterlogo.PNG'
            alt='Logo'
            width={374}
            height={374}
            className='navbar-logo cursor-pointer'
            onClick={closeNav}
          />
        </Link>
        <div className='hidden md:flex space-x-4 items-center'>
          <Link href='/#home'>
            <span onClick={(e) => handleSmoothScroll(e, '/#home')}>Home</span>
          </Link>
          <Link href='/about#about'>
            <span onClick={(e) => handleSmoothScroll(e, '/about#about')}>About</span>
          </Link>
          <Link href='/music#music-photography'>
            <span onClick={(e) => handleSmoothScroll(e, '/music#music-photography')}>Music</span>
          </Link>
          <Link href='/contact#work-with-me'>
            <span onClick={(e) => handleSmoothScroll(e, '/contact#work-with-me')}>Let’s talk</span>
          </Link>
          <Link href='/shop#shop'>
            <span onClick={closeNav}>Shop</span>
          </Link>
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
