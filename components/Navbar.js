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

  return (
    <div
      style={{ backgroundColor: nav ? 'black' : navbarStyle.backgroundColor }}
      className='fixed left-0 top-0 w-full z-30 ease-in duration-300'
    >
      <div className='max-w-[1240px] m-auto flex justify-between items-center p-4'>
        <Link href='/#home'>
          <Image src='/waterlogo.PNG' alt='Logo' width={187} height={187} />
        </Link>
        <div className='hidden md:flex space-x-4'>
          <Link href='/#home' passHref
             className='p-4'>
              Home
            
          </Link>
          <Link href='/about#about' passHref
             className='p-4'>
              About
            
          </Link>
          <Link href='/music#music-photography' passHref
            className='p-4'>
              Music
            
          </Link>
          <Link href='/contact#work-with-me' passHref
            className='p-4'>
              Contact
            
          </Link>
          <Link href='/shop#shop' passHref
             className='p-4'>
              Shop
            
          </Link>
          <FaInstagram size={24} className='p-4 cursor-pointer' />
          <FaLinkedin size={24} className='p-4 cursor-pointer' />
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
            <li className='p-4'>
              <Link href='/#home' passHref>
                
                  Home
                
              </Link>
            </li>
            <li className='p-4'>
              <Link href='/about#about' passHref>
                
                  About
                
              </Link>
            </li>
            <li className='p-4'>
              <Link href='/music#music' passHref>
                
                  Music
                
              </Link>
            </li>
            <li className='p-4'>
              <Link href='/contact#contact' passHref>
                
                  Contact
                
              </Link>
            </li>
            <li className='p-4'>
              <Link href='/shop#shop' passHref>
                
                  Shop
                
              </Link>
            </li>
          </ul>
        </div>
      )}
      <CartDrawer />
    </div>
  );
};

export default Navbar;
