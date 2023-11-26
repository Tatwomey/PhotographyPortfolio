// components/Navbar.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaInstagram, FaLinkedin } from 'react-icons/fa';
import CartIcon from './CartIcon';
import CartDrawer from './CartDrawer';

const Navbar = () => {
    const [nav, setNav] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
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
    const toggleCart = (e) => {
        e.preventDefault();
        setIsCartOpen(!isCartOpen);
    };

    return (
        <div style={{ backgroundColor: nav ? 'black' : navbarStyle.backgroundColor }} className='fixed left-0 top-0 w-full z-30 ease-in duration-300'>
            <div className='max-w-[1240px] m-auto flex justify-between items-center p-4 relative'>
                <Link href='/#home'>
                    <div className="navbar-logo cursor-pointer">
                        <Image 
                            src="/waterlogo.PNG" 
                            alt="Logo" 
                            width={187}
                            height={187}
                        />
                    </div>
                </Link>
                <div className="lg:hidden">
                    <button onClick={handleNav} className="absolute top-4 right-4">
                        {nav ? <AiOutlineClose size={30} /> : <AiOutlineMenu size={30} />}
                    </button>
                </div>
                <ul style={{ color: navbarStyle.color }} className={`${nav ? 'flex flex-col h-screen justify-center space-y-4 w-full items-center lg:items-start' : 'hidden'} lg:flex flex-col lg:flex-row`}
                    onClick={handleNav}>
                    <li className='p-4'>
                        <Link href='/#home'>Home</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/about#about'>About</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/music#music'>Music</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/contact#contact'>Contact</Link>
                    </li>
                    <li className='p-4'>
                        <Link href='/shop#shop'>Shop</Link>
                    </li>
                    <li className='p-4'>
                        <CartIcon onClick={toggleCart} />
                    </li>
                    <li className='p-4'>
                        <Link href="https://www.instagram.com/" passHref>
                            <FaInstagram size={24} />
                        </Link>
                    </li>
                    <li className='p-4'>
                        <Link href="https://www.linkedin.com/" passHref>
                            <FaLinkedin size={24} />
                        </Link>
                    </li>
                </ul>
            </div>
            {isCartOpen && <CartDrawer />}
        </div>
    );
};

export default Navbar;
