import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import productVideo from '/prodotti.mov';
import ProductsCard from "../components/ProductsCard";
import bread from '/bread-loafs.png';
import pizzaSlice from '/pizza(1).png';
import cookie from '/biscuits.png';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from "react";
import { productApi } from "../../api/productApi";


export default function Products() {

  const [products, setProducts] = useState();
  const [categorizedProducts, setCategorizedProducts] = useState({});
  const categoryRefs = useRef({});

  const fetchProducts = async() => {
    try {
      const response = await productApi.getAllProducts();
      setProducts(response);
      organizeProductsByCategory(response);
    } catch(error) {
      console.error('Errore nella richiesta dei prodotti', error);
    }
  };

  const organizeProductsByCategory = (products) => {
    const categories = {};
    products.forEach(product => {
      if (!categories[product.category]) {
        categories[product.category] = [];
      }
      categories[product.category].push(product);
    });
    setCategorizedProducts(categories);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const scrollToCategory = (category) => {
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero */}
      <motion.div 
        className='h-screen bg-gradient-to-b from-[#0a0906] via-[#0f0d09] to-[#131210] flex flex-col justify-center items-center relative'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <video
        autoPlay
        loop
        muted
        className="absolute w-full h-full object-cover"
        style={{ objectPosition: 'center' }}
      >
        <source src={productVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black opacity-50"></div>
        <motion.section
          className="pt-[80px] md:pt-0 absolute bottom-7 inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1 
            className='text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 text-5xl font-poppins font-bold mb-4 mx-auto text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            I NOSTRI PRODOTTI
          </motion.h1>
          <motion.p 
            className="bg-clip-text uppercase text-md md:text-2xl w-[350px] md:w-[450px] mx-auto text-center font-poppins bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            SIAMO SEMPRE ALLA RICERCA DELLA QUALITA' PER I NOSTRI PRODOTTI
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

      
      {/* Card Container */}
      <motion.div
        className='flex flex-col justify-center items-center relative'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.article
          className="bg-[#dadada] w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-20 space-y-5 py-4">
            <div onClick={() => scrollToCategory('Pane')} className="flex flex-col justify-center items-center cursor-pointer">
              <img src={bread} className="size-24"/>
              <span className="text-black font-poppins">PANE</span>
            </div>
            <div onClick={() => scrollToCategory('Aperitivo')} className="flex flex-col justify-center items-center cursor-pointer">
              <img src={pizzaSlice} className="size-20 mb-4 lg:mb-0"/>
              <span className="text-black font-poppins">APERITIVO</span>
            </div>
            <div onClick={() => scrollToCategory('Dolci')} className="flex flex-col justify-center items-center cursor-pointer">
              <img src={cookie} className="size-20 mb-4 lg:mb-0"/>
              <span className="text-black font-poppins">DOLCI</span>
            </div>
          </div>
        </motion.article>
        {/* Card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols mx-auto mt-5"
        >
          {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} ref={el => categoryRefs.current[category] = el} className="w-full mt-8">
              <h2 className="text-2xl text-left mb-2 uppercase font-poppins">{category}</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryProducts.map(product => (
                  <ProductsCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </motion.section>
      </motion.div>

      {/* Footer */}
      <Footer />
    </>
  )
}