import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bars3BottomLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '/image.png';
import avatarDefault from '/avatar.png'
import { useAuth0 } from '@auth0/auth0-react';
import axios from 'axios';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, getIdTokenClaims, loginWithRedirect, logout, user } = useAuth0();
  const [userInfo, setUserInfo] = useState(null); // Aggiungo uno stato per memorizzare le informazioni dell'utente dal backend
  const navigate = useNavigate();
  // console.log(user);

  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post('http://localhost:5001/api/auth/auth0-callback', { id_token });
          localStorage.setItem('authToken', response.data.token); // Salva il token
          setUserInfo(response.data.user);
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, getIdTokenClaims]);

  const handleProfileClick = () => {
    if (isAuthenticated && userInfo) {
      // Assumiamo che l'informazione sul ruolo sia disponibile in user.role
      if (userInfo.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } else {
      loginWithRedirect();
    }
  };
  console.log(userInfo);

  const AuthButton = () => {
    if (isAuthenticated && userInfo) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white focus:outline-none"
          >
            <img
              src={user?.picture || avatarDefault}
              alt="User"
              className="w-8 h-8 rounded-full"
            />
            <ChevronDown className="w-4 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-gray-200 rounded-md shadow-lg text-left py-1 font-poppins">
              <small className='text-gray-700 text-sm block px-4 py-2'>{user?.name}</small>             
              <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-400">
                {userInfo.role === 'admin' ? 'Dashboard' : 'Profile'}
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('authToken'); // Rimuove il token dal localStorage
                  logout({ returnTo: window.location.origin }); // Esegue il logout di Auth0
                }} 
                className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      );
    } else {
      return (
        <button className='text-white flex items-center' onClick={() => loginWithRedirect()}>
          <img src={avatarDefault} alt="Default Avatar" className="w-8 h-8 rounded-full mr-2" />
        </button>
      )
    }
  };

  return (
    <motion.nav 
      className="bg-black/85 fixed w-full py-3 z-10"
      initial={{ opacity: 1, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to='/' className='text-white'>
            <img src={logo} alt="Logo" className='h-12'/>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className='text-white hover:text-[#eee] hover:border-b-[1px] px-3 py-2 font-poppins'>
              HOME
            </Link>
            <Link to="/products" className='text-white hover:text-[#eee] hover:border-b-[1px] px-3 py-2 font-poppins'>
              PRODUCTS
            </Link>
            <button onClick={handleProfileClick} className='text-white hover:text-[#eee] hover:border-b-[1px] px-3 py-2 font-poppins'>
              PROFILE
            </button>
          </div>
          
          <div className="hidden md:block">
            <AuthButton />
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none"
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3BottomLeftIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="md:hidden min-h-screen" 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-2">
              <Link to="/" className='block text-white hover:text-[#eee] px-3 py-2 rounded-md'>
                HOME
              </Link>
              <Link to="/products" className='block text-white hover:text-[#eee] px-3 py-2 rounded-md'>
                PRODUCTS
              </Link>
              <button onClick={handleProfileClick} className='block text-white hover:text-[#eee] px-3 py-2 rounded-md w-full text-left'>
                PROFILE
              </button>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}