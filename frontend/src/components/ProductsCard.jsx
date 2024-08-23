import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingBagIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsCard({ product }) {
  const { cart, addToCart } = useCart();
  const [isActive, setIsActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [isInCart, setIsInCart] = useState(false);

  useEffect(() => {
    setIsInCart(cart.some(item => item._id === product._id));
  }, [cart, product._id]);

  const handleInteraction = () => {
    setIsActive(!isActive);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation(); // Previene l'attivazione di handleInteraction
    addToCart(product);
    setIsInCart(true);
    // Opzionale: resetta l'icona dopo un certo periodo
    // setTimeout(() => setIsInCart(false), 2000);
  };

  return (
    <motion.div
      className="relative w-64 h-96 rounded-lg overflow-hidden cursor-pointer shadow-xl"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => {
        setIsActive(false);
        setShowTooltip(false);
      }}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
      <img
        src={`http://localhost:5001${product.image}`}
        alt={product.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>

      <AnimatePresence>
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {isInCart ? (
              <h3 className="text-white text-lg font-bold font-poppins mb-2">
                Aggiunto al carrello!
              </h3>
            ) : (
              <>
                <h3 className="text-white text-lg font-bold font-poppins mb-2">
                  Ingredienti:
                </h3>
                <p className="text-white text-sm font-poppins text-center">
                  {product.description}
                </p>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className='absolute bottom-0 w-full p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className="text-lg font-poppins text-white">{product.name}</h2>
          </div>
          <div className="flex items-center">
            <span className="mr-4 font-poppins text-white">{product.price} €</span> 
            <div className="flex justify-center items-center">
              <motion.button
                onClick={handleAddToCart}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isInCart ? (
                    <motion.div
                      key="checkIcon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircleIcon className="text-green-500 w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="bagIcon"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ShoppingBagIcon className="text-white w-5 h-5 hover:text-[#dadada]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
              {showTooltip && !isInCart && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white text-black text-sm rounded shadow-lg whitespace-nowrap">
                  Aggiungi al carrello
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}