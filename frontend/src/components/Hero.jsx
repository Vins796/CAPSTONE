import { Link as ScrollLink } from "react-scroll";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import heroVideo from '/heroVideo.mov'; // Assicurati che il percorso sia corretto
import ScrollToTopButton from "./ScrollToTopButton";
import HeroButtons from "./HeroButtons";

export default function Hero() {
  return (
    <motion.div 
      className='relative min-h-screen flex flex-col justify-center items-center overflow-hidden'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        style={{ objectPosition: 'center' }}
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
      <motion.section
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.p 
          className="text[#eee] md:text-3xl w-full md-w-full mx-auto mb-4 font-sans text-lg hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          LA TRADIZIONE DEL NOSTRO TERRITORIO
        </motion.p>
        <motion.h1 
          className='md:hidden bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-100 bg-clip-text text-transparent text-5xl md:text-5xl font-poppins font-semibold uppercase mb-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Il Forno <br /> di Quartiere
        </motion.h1>
        <motion.h1 
          className='hidden md:block bg-gradient-to-r from-amber-700 via-amber-500 to-yellow-200 bg-clip-text text-transparent text-5xl md:text-5xl font-poppins font-semibold uppercase mb-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          L'AUTENTICO FORNO DI QUARTIERE
        </motion.h1>
        <motion.p 
          className="text[#eee] text-md md:text-2xl w-full max-w-[450px] mx-auto font-sans mb-4 hidden md:block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          DAL 1993
        </motion.p>
        <HeroButtons />
      </motion.section>
      <ScrollToTopButton />
    </motion.div>
  )
}