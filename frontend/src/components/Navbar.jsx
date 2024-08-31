import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Bars3BottomLeftIcon, ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { useCart } from "../context/CartContext";
import Cart from "./Cart";
import logo from "/image.png";
import { TbLogin, TbLogout } from "react-icons/tb";

// Stili per i link della navbar
const navLinkStyles = (isActive) =>
  `px-3 py-2 font-poppins ${
    isActive
      ? "bg-gradient-to-r from-amber-900 via-amber-600 to-yellow-100 bg-clip-text text-transparent"
      : "text-white hover:text-[#eee] hover:border-b-[1px]"
  }`;

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const { isAuthenticated, getIdTokenClaims, loginWithRedirect, logout, user } = useAuth0();
  const navigate = useNavigate();
  const { cart } = useCart();

  useEffect(() => {
    async function sendTokenToBackend() {
      if (isAuthenticated && user) {
        try {
          const claims = await getIdTokenClaims();
          const id_token = claims.__raw;
          const response = await axios.post("http://localhost:5001/api/auth/auth0-callback", { id_token });
          localStorage.setItem("authToken", response.data.token);
          setUserInfo(response.data.user);
        } catch (error) {
          console.error("Error syncing user with backend:", error);
        }
      }
    }
    sendTokenToBackend();
  }, [isAuthenticated, user, getIdTokenClaims]);

  const handleProfileClick = () => {
    if (isAuthenticated && userInfo) {
      navigate(userInfo.role === "admin" ? "/dashboard" : `/profile/${userInfo.id}`);
    } else {
      loginWithRedirect();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    logout({ returnTo: window.location.origin });
  };

  // Componente AuthButton con tooltip semplice
  const AuthButton = ({ isAuthenticated, onClick }) => {
    return (
      <div className="relative group hidden md:block">
        <button 
          onClick={onClick} 
          className="flex items-center gap-2 text-white hover:text-[#eee] px-3 py-2 rounded-md"
        >
          {isAuthenticated ? (
            <>
              <TbLogout className="size-6"/>
              {/* <span className="hidden md:inline text-xs">(Logout)</span> */}
            </>
          ) : (
            <>
              <TbLogin className="size-6"/>
              {/* <span className="hidden md:inline">Login</span> */}
            </>
          )}
        </button>
        <div className="absolute bottom-6 left-full transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          {isAuthenticated ? "Logout" : "Login"}
        </div>
      </div>
    );
  };

  return (
    <motion.nav
      className="bg-[#0f0f0f]/85 fixed w-full py-3 z-50"
      initial={{ opacity: 1, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink to="/" className="text-white">
            <img src={logo} alt="Logo" className="h-12" />
          </NavLink>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLink to="/" className={({ isActive }) => navLinkStyles(isActive)}>HOME</NavLink>
            <NavLink to="/products" className={({ isActive }) => navLinkStyles(isActive)}>PRODOTTI</NavLink>
            {isAuthenticated && (
              <NavLink 
                to={userInfo?.role === "admin" ? "/dashboard" : `/profile/${userInfo?.id || ''}`}
                className={({ isActive }) => navLinkStyles(isActive)}
              >
                {userInfo?.role === "admin" ? "DASHBOARD" : "PROFILE"}
              </NavLink>
            )}
          </div>

          {/* Cart and Auth Buttons */}
          <div className="flex items-center gap-2">
            {/* Cart Icon */}
            <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative">
              <ShoppingCartIcon className="size-6 text-white" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </button>
            
            {/* Auth Button */}
            <AuthButton 
              isAuthenticated={isAuthenticated} 
              onClick={isAuthenticated ? handleLogout : handleProfileClick} 
            />
            
            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-white focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <XMarkIcon className="h-6 w-6" /> : <Bars3BottomLeftIcon className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden min-h-screen"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="px-2 pt-2 pb-3 space-y-1 mt-2">
              <NavLink to="/" className="block text-white hover:text-[#eee] px-3 py-2 rounded-md">HOME</NavLink>
              <NavLink to="/products" className="block text-white hover:text-[#eee] px-3 py-2 rounded-md">PRODOTTI</NavLink>
              {isAuthenticated ? (
                <>
                  <button onClick={handleProfileClick} className="block text-white hover:text-[#eee] px-3 py-2 rounded-md w-full text-left">
                    {userInfo?.role === "admin" ? "DASHBOARD" : "PROFILE"}
                  </button>
                  <button onClick={handleLogout} className="block text-white hover:text-[#eee] px-3 py-2 rounded-md w-full text-left">
                    LOGOUT
                  </button>
                </>
              ) : (
                <button onClick={() => loginWithRedirect()} className="block text-white hover:text-[#eee] px-3 py-2 rounded-md w-full text-left">
                  LOGIN
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-full w-96 bg-[#0f0f0f] shadow-lg z-50 overflow-y-auto"
          >
            <Cart isCartOpen={isCartOpen} closeCart={() => setIsCartOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}