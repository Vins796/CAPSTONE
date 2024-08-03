import { useState } from 'react';
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from 'framer-motion';
import prod1 from '/prod1.jpg';

export default function ProductsCard() {
  const [isActive, setIsActive] = useState(false);

  const handleInteraction = () => {
    setIsActive(!isActive);
  };

  return (
    <motion.div 
      className="relative w-64 h-[350px] rounded-lg overflow-hidden cursor-pointer shadow-xl"
      onMouseEnter={() => setIsActive(true)}
      onMouseLeave={() => setIsActive(false)}
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
    >
        <img 
            src={prod1} 
            alt="prod1"
            className="absolute inset-0 w-full h-full object-cover"
        />
        <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
        
        <AnimatePresence>
          {isActive && (
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-white text-lg font-bold font-poppins mb-2">Ingredienti:</h3>
              <p className="text-white text-sm font-poppins text-center">
                Farina integrale, semi di girasole, semi di zucca, semi di lino, lievito madre, sale marino
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex justify-between items-center">
            <div className="absolute bottom-0 left-0 p-4 text-white z-10">
                <h2 className="text-lg font-poppins">Pane ai cereali</h2>
            </div>
            <div className="absolute bottom-0 right-0 p-4 text-white z-10">
                <button><ShoppingBagIcon className="text-white size-4" /></button>
            </div>
        </div>
    </motion.div>
  )
}