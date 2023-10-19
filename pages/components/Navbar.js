import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';

const Navbar = ({ showAbout, setShowAbout }) => {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState('transparent');
  const [textColor, setTextColor] = useState('white');

  // Use a single logo
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
      <div className='max-w-[1240px] m-auto flex justify-between items-center p-4'>
        <Link href='/'>
          <h1 className='font-bold text-4xl cursor-pointer'>
            <img src={logo} alt="Logo" className="navbar-logo" />
          </h1>
        </Link>
        <div className="lg:hidden">
          <button onClick={handleNav}>
            {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
          </button>
        </div>
        <div className="flex items-center">
          <ul style={{ color: `${textColor}` }} className={`${nav ? '' : 'hidden'} lg:flex flex-col lg:flex-row`}>
            <li className='p-4'>
              <Link href='/'>Home</Link>
            </li>
            <li className='p-4'>
              <Link href='/#about-trevor-twomey'>About</Link>
            </li>
            <li className='p-4'>
              <Link href='/music#music-photography'>Music</Link>
            </li>
            <li className='p-4'>
              <Link href='/contact#work-with-me'>Contact</Link>
            </li>
          </ul>
          <div className="flex space-x-4 ml-4">
            <a href="https://www.instagram.com/trevortwomey/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram size={24} style={{ color: `${textColor}` }}/>
            </a>
            <a href="https://www.linkedin.com/in/trevor-twomey/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin size={24} style={{ color: `${textColor}` }}/>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
