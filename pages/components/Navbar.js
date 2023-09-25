import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [color, setColor] = useState('transparent');
  const [textColor, setTextColor] = useState('white');
  const [logo, setLogo] = useState("/waterlogo.PNG");

  useEffect(() => {
    const changeColor = () => {
      if (window.scrollY >= 90) {
          setColor('black'); 
          setTextColor('white');
          setLogo("/Watermarklogo.png");
      } else {
          setColor('transparent');
          setTextColor('white');
          setLogo("/waterlogo.PNG");
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
    <div style={{ backgroundColor: `${color}` }} className='fixed left-0 top-0 w-full z-10 ease-in duration-300'>
        <div className='max-w-[1240px] m-auto flex justify-between items-center p-4'>
            <Link href='/'>
                <h1 className='font-bold text-4xl'>
                    <img
                        src={logo}
                        alt="Logo"
                        width="250"
                        height="50"
                    />
                </h1>
            </Link>
            <div className="sm:hidden">
                <button onClick={handleNav}>
                    {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
                </button>
            </div>
            <ul style={{ color: `${textColor}` }} className={`sm:flex ${nav ? 'flex' : 'hidden'} flex-col sm:flex-row`}>
                <li className='p-4'>
                    <Link href='/'>Home</Link>
                </li>
                <li className='p-4'>
                    <Link href='/#gallery'>Gallery</Link>
                </li>
                <li className='p-4'>
                    <Link href='/music#music-photography'>Music</Link>
                </li>
                <li className='p-4'>
                    <Link href='/contact#work-with-me'>Contact</Link>
                </li>
            </ul>
        </div>
    </div>
);
};

export default Navbar;