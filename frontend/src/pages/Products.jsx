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
import ScrollToTopButton from "../components/ScrollToTopButton";

export default function Products() {
  // Stati per gestire i prodotti e le categorie
  const [products, setProducts] = useState();
  const [categorizedProducts, setCategorizedProducts] = useState({});
  // Ref per lo scrolling alle categorie
  const categoryRefs = useRef({});

  // Funzione per recuperare i prodotti dall'API
  const fetchProducts = async() => {
    try {
      const response = await productApi.getAllProducts();
      setProducts(response);
      organizeProductsByCategory(response);
    } catch(error) {
      console.error('Errore nella richiesta dei prodotti', error);
    }
  };

  // Funzione per organizzare i prodotti per categoria
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

  // Effetto per caricare i prodotti al montaggio del componente
  useEffect(() => {
    fetchProducts();
  }, []);

  // Funzione per scorrere alla categoria selezionata
  const scrollToCategory = (category) => {
    categoryRefs.current[category]?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <>
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <motion.div 
        className='h-screen bg-gradient-to-b from-[#0a0906] via-[#0f0d09] to-[#131210] flex flex-col justify-center items-center relative'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* Video di sfondo */}
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
        {/* Overlay scuro sul video */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        {/* Contenuto hero */}
        <motion.section
          className="absolute bottom-7 inset-x-0 md:bottom-auto md:top-1/2 md:-translate-y-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <motion.h1 
            className='text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 text-3xl md:text-5xl font-poppins font-bold mb-3 mx-auto text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            I NOSTRI PRODOTTI
          </motion.h1>
          <motion.p 
            className="bg-clip-text uppercase text-lg md:text-2xl w-[350px] md:w-[450px] mx-auto text-center font-poppins bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            SIAMO SEMPRE ALLA RICERCA DELLA QUALITA' PER I NOSTRI PRODOTTI
          </motion.p>
        </motion.section>
      </motion.div>

      {/* Sezione Categorie e Prodotti */}
      <motion.div
        className='flex flex-col justify-center items-center relative bg-[#0f0f0f]'
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* Navigazione delle categorie */}
        <motion.article
          className="bg-[#dadada] w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="flex flex-col lg:flex-row lg:justify-center lg:items-center lg:gap-32 py-4">
            {/* Bottoni per scrollare alle categorie */}
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
        
        {/* Sezione prodotti */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="grid grid-cols mx-auto mt-5"
        >
          {/* Mappa attraverso le categorie e i prodotti */}
          {Object.entries(categorizedProducts).map(([category, categoryProducts]) => (
            <div key={category} ref={el => categoryRefs.current[category] = el} className="w-full mt-8">
              <h2 className="text-2xl text-left mb-2 uppercase font-poppins">{category}</h2>
              <div className="h-1 w-32 bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {categoryProducts.map(product => (
                  <ProductsCard key={product._id} product={product} />
                ))}
              </div>
            </div>
          ))}
        </motion.section>
        <ScrollToTopButton />
      </motion.div>

      {/* Footer */}
      <Footer />
    </>
  )
}