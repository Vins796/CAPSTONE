import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/image.png';

import LoginButton from './LoginButton';
import LogoutButton from './LogoutButton';

import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, getIdTokenClaims, loginWithRedirect, logout } = useAuth0();

  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post('http://localhost:5001/api/auth/auth0-callback', { id_token });
          console.log('User synchronized with backend:', response.data);
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, getIdTokenClaims]);

  const menuItems = ['HOME', 'ABOUT', 'PRODUCTS', 'PROFILE'];

  const AuthButton = () => {
    if (isAuthenticated) {
      return <button className='text-white' onClick={() => logout({ returnTo: window.location.origin })}>LOGOUT</button>;
    } else {
      return <button className='text-white' onClick={() => loginWithRedirect()}>LOGIN</button>;
    }
  };

  const { user } = useAuth0();
  console.log(user);

  return (
    <motion.nav 
      className="bg-black/85 fixed w-full py-3 z-10"
      initial={{ opacity: 1, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-center">
          <motion.div 
            className="flex items-center md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Link to='/' className='text-white'>
              <img src={logo} alt="Logo" className='h-12'/>
            </Link>
          </motion.div>
          <motion.div 
            className="hidden md:flex md:items-center md:space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, staggerChildren: 0.1 }}
          >
            {menuItems.slice(0, 2).map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className='text-white hover:text-[#eee] hover:border-b-[1px] px-3 py-2 font-poppins'>
                  {item}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link to='/' className='text-white'>
                <img src={logo} alt="Logo" className='h-12 mx-4'/>
              </Link>
            </motion.div>
            {menuItems.slice(2).map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Link to={`/${item.toLowerCase()}`} className='text-white hover:text-[#eee] hover:border-b-[1px] px-3 py-2 font-poppins'>
                  {item}
                </Link>
              </motion.div>
            ))}
            <AuthButton />
          </motion.div>
          <motion.div 
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden" 
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link to={item === 'Home' ? '/' : `/${item.toLowerCase()}`} className='text-white hover:text-[#eee] block px-3 py-2 rounded-md'>
                    {item}
                  </Link>
                </motion.div>
              ))}
              <AuthButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}