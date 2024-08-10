import { Link as ScrollLink } from "react-scroll";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import heroVideo from '/heroVideo.mov'; // Assicurati che il percorso sia corretto

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
          className="text[#eee] md:text-3xl w-full md-w-full mx-auto mb-4 font-sans text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          LA TRADIZIONE DEL NOSTRO TERRITORIO
        </motion.p>
        <motion.h1 
          className='text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 text-5xl font-poppins font-bold mb-4'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          L'AUTENTICO FORNO DI QUARTIERE!
        </motion.h1>
        <motion.p 
          className="text[#eee] text-md md:text-2xl w-full max-w-[450px] mx-auto font-sans text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          DAL 1993
        </motion.p>
        <motion.div 
          className="flex gap-5 justify-center items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link to='/products'><button className="bg-[#eee] h-10 px-3 font-poppins text-black hover:shadow-lg">PRODOTTI</button></Link>
          <ScrollLink 
            to="about-section" 
            smooth={true} 
            duration={500} 
            offset={-72}
          >
            <button className="bg-[#000] h-10 px-3 text-white font-poppins hover:shadow-lg">ABOUT</button>
          </ScrollLink>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}