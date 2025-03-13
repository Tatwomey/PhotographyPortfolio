import React, { useState, useEffect } from 'react';
import Link from 'next/link';
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
          <Link href='/#home' onClick={closeNav}>Home</Link>
          <Link href='/about#about' onClick={closeNav}>About</Link>
          <Link href='/music#music-photography' onClick={closeNav}>Music</Link>
          <Link href='/contact#work-with-me' onClick={closeNav}>Let&apos;s talk</Link>
          <Link href='/shop#shop' onClick={closeNav}>Shop</Link>
          <div className='flex space-x-2'>
            <a href='https://www.instagram.com/trevortwomey/' target='_blank' rel='noopener noreferrer'>
              <FaInstagram size={20} className='cursor-pointer' />
            </a>
            <a href='https://www.linkedin.com/in/trevor-twomey' target='_blank' rel='noopener noreferrer'>
              <FaLinkedin size={20} className='cursor-pointer' />
            </a>
          </div>
        </div>

        <div onClick={handleNav} className='block md:hidden z-10 cursor-pointer'>
          {nav ? (
            <AiOutlineClose size={30} className='text-white' />
          ) : (
            <AiOutlineMenu size={30} className='text-white' />
          )}
        </div>

        {/* Load CartIcon only on the client side */}
        {typeof window !== "undefined" && <CartIcon />}
      </div>

      {nav && (
        <div className='md:hidden'>
          <ul style={{ color: navbarStyle.color }} className='flex flex-col space-y-4'>
            <li onClick={closeNav}><Link href='/#home'>Home</Link></li>
            <li onClick={closeNav}><Link href='/about#about'>About</Link></li>
            <li onClick={closeNav}><Link href='/music#music-photography'>Music</Link></li>
            <li onClick={closeNav}><Link href='/contact#work-with-me'>Let&apos;s talk</Link></li>
            <li onClick={closeNav}><Link href='/shop#shop'>Shop</Link></li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
