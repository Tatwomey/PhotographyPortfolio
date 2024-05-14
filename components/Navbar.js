import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import CartIcon from './CartIcon';
import CartDrawer from './CartDrawer';
import { useShopContext } from '../contexts/shopContext';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'transparent',
    color: 'white',
  });
  const { cart } = useShopContext();

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
  const closeNav = () => setNav(false);  // Function to explicitly close the navbar

  const handleSocialClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    closeNav();
  };

  return (
    <div
      style={{ backgroundColor: nav ? 'black' : navbarStyle.backgroundColor }}
      className='fixed left-0 top-0 w-full z-30 ease-in duration-300'
    >
      <div className='max-w-[1240px] m-auto flex justify-between items-center p-4'>
        <Link href='/#home' onClick={closeNav}>
          <Image src='/waterlogo.PNG' alt='Logo' width={187} height={187} style={{ cursor: 'pointer' }} />
        </Link>
        <div className='hidden md:flex space-x-4'>
          <Link href='/#home' onClick={closeNav}>Home</Link>
          <Link href='/about#about' onClick={closeNav}>About</Link>
          <Link href='/music#music-photography' onClick={closeNav}>Music</Link>
          <Link href='/contact#work-with-me' onClick={closeNav}>Contact</Link>
          <Link href='/shop#shop' onClick={closeNav}>Shop</Link>
          <div className='hidden md:flex space-x-4' onClick={() => handleSocialClick('https://www.instagram.com/trevortwomey/')}>
            <FaInstagram size={24} className='cursor-pointer' />
          </div>
          <div className='hidden md:flex space-x-4' onClick={() => handleSocialClick('https://www.linkedin.com/in/trevor-twomey')}>
            <FaLinkedin size={24} className='cursor-pointer' />
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
      {nav && (
        <div className='md:hidden'>
          <ul style={{ color: navbarStyle.color }}>
            <li onClick={closeNav}><Link href='/#home'>Home</Link></li>
            <li onClick={closeNav}><Link href='/about#about'>About</Link></li>
            <li onClick={closeNav}><Link href='/music#music-photography'>Music</Link></li>
            <li onClick={closeNav}><Link href='/contact#contact'>Contact</Link></li>
            <li onClick={closeNav}><Link href='/shop#shop'>Shop</Link></li>
            <li className='flex-start'>
              <div onClick={() => handleSocialClick('https://www.instagram.com/trevortwomey/')}>
                <FaInstagram size={20} className='cursor-pointer' />
              
              <div onClick={() => handleSocialClick('https://www.linkedin.com/in/trevor-twomey')}>
                <FaLinkedin size={20} className='cursor-pointer' />
              </div>
</div>
            </li>
          </ul>
        </div>
      )}
      <CartDrawer />
    </div>
  );
};

export default Navbar;