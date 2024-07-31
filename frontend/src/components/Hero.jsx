import { Link } from "react-router-dom";
import { motion } from 'framer-motion';

export default function Hero() {
  return (
    <motion.div 
      className='min-h-screen bg-gradient-to-b from-[#0a0906] via-[#0f0d09] to-[#131210] flex flex-col justify-center items-center'
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
          className="bg-gradient-to-b from-gray-400 via-red-400 to-orange-300 text-transparent bg-clip-text text-[#eee] text-md md:text-2xl w-[300px] md:w-[450px] mx-auto text-center font-poppins"
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
          <Link to='/products'><button className="bg-[#eee] rounded h-10 px-3 font-poppins">Products</button></Link>
          <Link to='/about'><button className="bg-[#000] rounded h-10 px-3 text-white font-poppins">About</button></Link>
        </motion.div>
      </motion.section>
    </motion.div>
  )
}