import { Link as ScrollLink } from "react-scroll";
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import hero from '/hero.jpg'

export default function Hero() {
  return (
    <motion.div 
      className='min-h-screen bg-gradient-to-b from-zinc-900 via-neutral-900 to-stone-900 flex flex-col justify-center items-center'
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.section
        className="pt-[80px] md:pt-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <motion.h1 
          className='bg-gradient-to-b from-gray-400 via-gray-200 to-gray-500 text-transparent bg-clip-text text-5xl font-poppins font-bold text-center mb-5 w-96 md:w-[70%] mx-auto'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          LA TUA AMICHEVOLE PANETTERIA DI QUARTIERE!
        </motion.h1>
        <motion.p 
          className="text-transparent bg-clip-text text-[#eee] text-md md:text-2xl w-[300px] md:w-[450px] mx-auto text-center font-poppins bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Da noi potrai trovare sempre prodotti freschi del nostro territorio.
        </motion.p>
        <motion.div 
          className="flex gap-5 justify-center items-center mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          <Link to='/products'><button className="bg-[#eee] h-10 px-3 font-poppins text-black">Products</button></Link>
          <ScrollLink 
            to="about-section" 
            smooth={true} 
            duration={500} 
            offset={-70} // Aggiusta questo valore in base all'altezza della tua navbar
          >
            <button className="bg-[#000] h-10 px-3 text-white font-poppins">About</button>
          </ScrollLink>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}