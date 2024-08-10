import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Bars3BottomLeftIcon, ShoppingCartIcon, XMarkIcon } from '@heroicons/react/24/outline';
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

  const ProfileLink = () => {
    if (isAuthenticated && userInfo && userInfo.id) {
      return (
        <NavLink to="/profile/66b25be7618fa0dc29f9f1fc" className={({ isActive }) => `px-3 py-2 font-poppins ${isActive ? activeClass : inactiveClass}`}>
          PROFILE
        </NavLink>
      );
    }
    return null;
  };

  const activeClass = "bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900 bg-clip-text text-transparent";
  const inactiveClass = "text-white hover:text-[#eee] hover:border-b-[1px] font-poppins";


  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated && user) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post('http://localhost:5001/api/auth/auth0-callback', { id_token });
          // console.log('Response from backend:', response.data);
          localStorage.setItem('authToken', response.data.token);
          setUserInfo(response.data.user);
        } catch (error) {
          console.error('Error syncing user with backend:', error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, user, getIdTokenClaims]);

  const handleProfileClick = () => {
    if (isAuthenticated && userInfo) {
      console.log("UserInfo in handleProfileClick:", userInfo);
      if (userInfo.role === 'admin') {
        navigate('/dashboard');
      } else if (userInfo.id) {
        navigate(`/profile/${userInfo.id}`, { replace: true });
      } else {
        console.error('ID utente non disponibile');
      }
    } else {
      loginWithRedirect();
    }
  };

  console.log(userInfo);

  const AuthButton = () => {
    if (isAuthenticated && user) {
      return (
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center space-x-2 text-white focus:outline-none"
          >
            {user?.picture && 
              <img
                src={user.picture}
                alt="User"
                className="w-8 h-8 rounded-full"
              />
            }
            <ChevronDown className="w-6 h-4" />
          </button>
          {isDropdownOpen && (
            <div className="absolute left-0 mt-2 w-44 bg-gray-200 rounded-md shadow-lg text-left py-1 font-poppins">
              <small className='text-gray-700 text-sm block px-4 py-2 w-full'>{user?.name}</small>             
              <button onClick={handleProfileClick} className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-400">
                {userInfo?.role === 'admin' ? 'Dashboard' : 'Profile'}
              </button>
              <button 
                onClick={() => {
                  localStorage.removeItem('authToken');
                  logout({ returnTo: window.location.origin });
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
          <NavLink to='/' className='text-white'>
            <img src={logo} alt="Logo" className='h-12'/>
          </NavLink>
          
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => `px-3 py-2 font-poppins ${ isActive ? activeClass : inactiveClass }`}>
              HOME
            </NavLink>
            <NavLink to="/products" className={({ isActive }) => `px-3 py-2 font-poppins ${ isActive ? activeClass : inactiveClass }`}>
              PRODOTTI
            </NavLink>
            {userInfo?.role === 'admin' ? (
              <NavLink to='/dashboard' onClick={handleProfileClick} className={({ isActive }) => `px-3 py-2 font-poppins ${ isActive ? activeClass : inactiveClass }`}>
              DASHBOARD
            </NavLink>
            ) : (
              <ProfileLink />
            )}
            
          </div>
          
          <div className="hidden md:flex md:gap-4 md:items-center">
            <button><ShoppingCartIcon className='size-6 text-white'/></button>
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
              <NavLink to="/" className='block text-white hover:text-[#eee] px-3 py-2 rounded-md'>
                HOME
              </NavLink>
              <NavLink to="/products" className='block text-white hover:text-[#eee] px-3 py-2 rounded-md'>
                PRODUCTS
              </NavLink>
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