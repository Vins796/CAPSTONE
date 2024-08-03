import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';
import banner from '/bread.jpg'
import ProductsCard from "../components/ProductsCard";


export default function Products() {
  return (
    <>
      {/* Navbar */}
      <Navbar />
      <motion.div 
        className='min-h-screen bg-gradient-to-b from-[#0a0906] via-[#0f0d09] to-[#131210] flex flex-col justify-center items-center relative'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <img src={banner} alt="banner" className="absolute inset-0 w-full h-full object-cover object-center"/>
        <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
        <motion.section
          className="pt-[80px] md:pt-0 absolute bottom-7 inset-x-0"
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
            I NOSTRI PRODOTTI
          </motion.h1>
          <motion.p 
            className="text-transparent bg-clip-text text-[#eee] text-md md:text-2xl w-[350px] md:w-[450px] mx-auto text-center font-poppins bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            Ricerchiamo costantemente la qualità di ogni singolo prodotto utilizzato.
          </motion.p>
          <motion.div 
            className="flex gap-5 justify-center items-center mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
          </motion.div>
        </motion.section>
      </motion.div>

      

      <motion.div
        className='flex flex-col justify-center items-center relative bg-white p-5'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols mx-auto"
        >
          <ProductsCard />
        </motion.section>
      </motion.div>

      {/* Footer */}
      <Footer />
    </>
  )
}