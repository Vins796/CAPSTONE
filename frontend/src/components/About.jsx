import React from 'react';
import { motion } from 'framer-motion';
import { CalendarIcon } from 'lucide-react';
import about from '/about.jpg'

const timelineItems = [
  { 
    year: '1970', 
    title: "NASCITA",
    description: 'La bottega viene rilevata dalla famiglia Cirio che fa conoscere in tutto il chierese e dintorni gli ottimi grissini Rubatà di Poirino.'
  },
  { 
    year: '1980', 
    title: "EVOLUZIONE",
    description: 'Con la famiglia Menzio la bottega si evolve diventando panificio e pasticceria artigianale in seguito ad un ampia ristrutturazione.'
  },
  { 
    year: '1993', 
    title: "ESPANSIONE",
    description: 'Il panificio viene acquisito dalla Famiglia Rubinetto che per quasi un trentennio gestisce con ottimi risultati il Forno.'
  },
  { 
    year: '2022', 
    title: "INNOVAZIONE",
    description: 'Con la nuova gestione della famiglia Agostini l attività de Il Forno prosegue, cercando sempre di innovarsi pur rimanendo sempre legata alle tradizioni e ai suoi prodotti.'
  }
];

const TimelineItem = ({ item, index }) => (
  <motion.div 
    className="flex items-center mb-16"
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
  >
    <div className="w-24 relative">
      <div className=" ml-3 w-1 h-full bg-amber-500 absolute left-1/2 transform -translate-x-1/2"></div>
      <div className="w-12 h-12 rounded-full bg-amber-500 border-4 border-white shadow flex items-center justify-center">
        <CalendarIcon className="text-white w-6 h-6" />
      </div>
    </div>
    <div className="flex-1 pl-8">
      <h3 className="text-3xl font-bold text-amber-700 mb-2">{item.year}</h3>
      <h4 className="text-2xl font-semibold font-poppins mb-2 text-amber-900">{item.title}</h4>
      <p className="text-gray-600">{item.description}</p>
    </div>
  </motion.div>
);

export default function ImprovedAboutTimeline() {
  return (
    <div id='about-section' className="bg-gradient-to-b from-amber-50 to-amber-100 py-16">
      <div className="max-w-7xl mx-auto px-4">
        <motion.h2 
          className="text-4xl font-bold font-poppins text-center mb-16 text-amber-800"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          LA NOSTRA STORIA
        </motion.h2>
        <div className="flex flex-col md:flex-row md:items-center gap-8">
          <motion.div 
            className="md:w-1/3"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="">
              <img 
                src={about} 
                alt="Il Forno di Agostini attraverso gli anni" 
                className="w-full h-full rounded-lg shadow-xl"
              />
              <p className="mt-4 text-center text-gray-600 italic">
                Il nostro forno attraverso gli anni
              </p>
            </div>
          </motion.div>
          <div className="md:w-2/3">
            <div className="relative">
              {timelineItems.map((item, index) => (
                <TimelineItem key={item.year} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}