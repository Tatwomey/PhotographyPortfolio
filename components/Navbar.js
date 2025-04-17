import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import { useRouter } from 'next/router';
import CartIcon from './CartIcon';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [navbarStyle, setNavbarStyle] = useState({
    backgroundColor: 'transparent',
    color: 'white',
  });

  const router = useRouter();
  const isShopPage = router.pathname.startsWith('/shop') || router.pathname.startsWith('/popup');

  useEffect(() => {
    if (isShopPage) {
      setNavbarStyle({ backgroundColor: 'white', color: 'black' });
      return;
    }

    const changeColor = () => {
      if (window.scrollY >= 90) {
        setNavbarStyle({ backgroundColor: 'black', color: 'white' });
      } else {
        setNavbarStyle({ backgroundColor: 'transparent', color: 'white' });
      }
    };

    window.addEventListener('scroll', changeColor);
    return () => window.removeEventListener('scroll', changeColor);
  }, [isShopPage]);

  const handleNav = () => setNav(!nav);
  const closeNav = () => setNav(false);

  return (
    <div
      style={{
        backgroundColor: nav ? 'black' : navbarStyle.backgroundColor,
        transition: 'background-color 0.3s ease',
      }}
      className="fixed left-0 top-0 w-full z-50 transition-opacity duration-300 opacity-100"
    >
      <div className="max-w-[1280px] m-auto flex justify-between items-center py-4 px-4">
        <Link href="/#home" onClick={closeNav}>
          <Image
            src={isShopPage ? '/Watermarklogo_bw.png' : '/Watermarklogo_2025.png'}
            alt="Logo"
            width={374}
            height={374}
            className="navbar-logo transition-all duration-500 ease-in-out"
            style={{ cursor: 'pointer' }}
          />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-4 items-center">
          {[
            { href: '/#home', label: 'Home' },
            { href: '/about#about', label: 'About' },
            { href: '/music#music-photography', label: 'Music' },
            { href: '/contact#work-with-me', label: "Let's talk" },
            { href: '/shop#shop', label: 'Shop' },
          ].map(({ href, label }) => (
            <Link key={label} href={href} onClick={closeNav}>
              <span className={`text-sm font-medium ${isShopPage ? 'text-black' : 'text-white'}`}>
                {label}
              </span>
            </Link>
          ))}

          <div className="flex space-x-2">
            <a
              href="https://www.instagram.com/trevortwomey/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram
                size={20}
                className={`cursor-pointer ${isShopPage ? 'text-black' : 'text-white'}`}
              />
            </a>
            <a
              href="https://www.linkedin.com/in/trevor-twomey"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin
                size={20}
                className={`cursor-pointer ${isShopPage ? 'text-black' : 'text-white'}`}
              />
            </a>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <div onClick={handleNav} className="block md:hidden z-50 cursor-pointer">
          {nav ? (
            <AiOutlineClose size={30} className={isShopPage ? 'text-black' : 'text-white'} />
          ) : (
            <AiOutlineMenu size={30} className={isShopPage ? 'text-black' : 'text-white'} />
          )}
        </div>

        {/* Client-side Cart Icon */}
        {typeof window !== 'undefined' && <CartIcon isDarkMode={!isShopPage} />}

      </div>

      {/* Mobile Nav */}
      {nav && (
        <div className={`md:hidden py-4 ${isShopPage ? 'bg-white' : 'bg-black'}`}>
          <ul
            className={`flex flex-col space-y-4 px-6 text-lg ${
              isShopPage ? 'text-black' : 'text-white'
            }`}
          >
            <li onClick={closeNav}>
              <Link href="/#home">Home</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/about#about">About</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/music#music-photography">Music</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/contact#work-with-me">Let&apos;s talk</Link>
            </li>
            <li onClick={closeNav}>
              <Link href="/shop#shop">Shop</Link>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
