import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState('transparent');
  const [textColor, setTextColor] = useState('white');

  const logo = "/waterlogo.PNG";

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 90) {
        setColor('black'); 
        setTextColor('white');
      } else {
        setColor('transparent');
        setTextColor('white');
      }
    };
    window.addEventListener('scroll', changeColor);
    return () => {
      window.removeEventListener('scroll', changeColor);
    };
  }, []);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div style={{ backgroundColor: `${color}` }} className='fixed left-0 top-0 w-full z-30 ease-in duration-300'>
      <div className='max-w-[1240px] m-auto flex justify-between items-center p-4 relative'>
        <Link href='/#home'>
          <h1 className='font-bold text-4xl cursor-pointer absolute left-4 top-4 lg:static'>
            <img src={logo} alt="Logo" className="navbar-logo" />
          </h1>
        </Link>
        <div className="lg:hidden">
          <button onClick={handleNav} className="absolute top-4 right-4">
            {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
          </button>
        </div>
        <ul style={{ color: `${textColor}` }} className={`${nav ? 'flex flex-col h-screen justify-center space-y-4 w-full items-center lg:items-start' : 'hidden'} lg:flex flex-col lg:flex-row`}>
          <li className='p-4'>
            <Link href='/music#music-photography'>Home</Link>
          </li>
          <li className='p-4'>
            <Link href='/about#about-trevor-twomey'>About</Link>
          </li>
          <li className='p-4'>
            <Link href='/music#music-photography'>Music</Link>
          </li>
          <li className='p-4'>
            <Link href='/contact#work-with-me'>Contact</Link>
          </li>
          <li className='p-4'>
            <a href="https://www.instagram.com/trevortwomey/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={24} />
            </a>
          </li>
          <li className='p-4'>
            <a href="https://www.linkedin.com/in/trevor-twomey/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={24} />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
