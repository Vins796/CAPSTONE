import { useState } from "react";
import { useCart } from "../context/CartContext";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductsCard({ product }) {
  const { addToCart } = useCart();
  const [isActive, setIsActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleInteraction = () => {
    setIsActive(!isActive);
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
            <h3 className="text-white text-lg font-bold font-poppins mb-2">
              Ingredienti:
            </h3>
            <p className="text-white text-sm font-poppins text-center">
              {product.description}
            </p>
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
            <div className="relative">
              <button
                onClick={() => addToCart(product)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <ShoppingBagIcon className="text-white w-5 h-5 hover:text-[#dadada]" />
              </button>
              {showTooltip && (
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