import React from 'react';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";

const CustomButton = ({ to, text, isScrollLink }) => {
  const ButtonComponent = isScrollLink ? ScrollLink : Link;
  
  return (
    <ButtonComponent
      to={to}
      smooth={isScrollLink}
      duration={isScrollLink ? 500 : undefined}
      offset={isScrollLink ? -72 : undefined}
      className="relative inline-block group"
    >
      <motion.div
        className="relative z-10 px-8 py-3 font-poppins text-lg font-medium text-white bg-transparent border-2 border-white rounded-full overflow-hidden"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="relative z-10">{text}</span>
        <motion.div
          initial={{ x: '-100%' }}
          whileHover={{ x: 0 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
      {/* <div className="absolute inset-0 bg-[#92-400e] blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" /> */}
    </ButtonComponent>
  );
};

export default function HeroButtons() {
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8">
      <CustomButton to="/products" text="PRODOTTI" />
      <CustomButton to="about-section" text="ABOUT" isScrollLink />
    </div>
  );
}