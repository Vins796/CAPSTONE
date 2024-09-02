import { motion } from 'framer-motion';
import bakery from '/campo.jpg';
import { CalendarIcon } from '@heroicons/react/24/outline'

export default function About() {
    const timelineItems = [
        { 
          year: '1970', 
          title: "NASCITA",
          description: 'La bottega viene rilevata dalla famiglia Cirio che fa conoscere in tutto il chierese e dintorni gli ottimi grissini Rubatà di Poirino'
        },
        { 
          year: '1980', 
          title: "EVOLUZIONE",
          description: 'Con la famiglia Menzio la bottega si evolve diventando panificio e pasticceria artigianale in seguito ad un ampia ristrutturazione'
        },
        { 
          year: '1993', 
          title: "ESPANSIONE",
          description: 'Il panificio viene acquisito dalla Famiglia Rubinetto che per quasi un trentennio gestisce con ottimi risultati il Forno'
        },
        { 
          year: '2022', 
          title: "INNOVAZIONE",
          description: 'Con la nuova gestione della famiglia Agostini l attività de Il Forno prosegue, cercando sempre di innovarsi pur rimanendo sempre legata alle tradizioni e ai suoi prodotti'
        }
        
    ];

    return (
      <>
        <div className='bg-[#cccc] h-1 w-full'></div>
        <motion.div 
          id="about-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className='relative'>
              <img src={bakery} alt="img" className="aspect-auto w-full h-auto lg:h-[700px] bg-cover bg-center bg-fixed bg-no-repeat" />
              <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
              <div className='absolute inset-x-0 bottom-0 flex flex-col justify-center items-center pb-8 '>
                  <h2 className='text-transparent bg-clip-text bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400 text-3xl font-bold px-4 py-2 font-poppins'>
                      LA NOSTRA STORIA
                  </h2>
                  <div className='h-1 w-72 bg-gradient-to-r from-slate-300 via-gray-300 to-gray-400'></div>
              </div>
          </div>
          <div className="mx-auto py-8 md:py-16 px-4 bg-[#dbdbdbee] w-full">
            <div className="max-w-4xl mx-auto">
              {timelineItems.map((item, index) => (
                <div key={item.year} className={`flex flex-col md:flex-row items-center mb-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="flex-1 w-full md:w-1/2 mb-4 md:mb-0">
                    <div className="bg-[#0f0f0f] p-8 lg:p-12 rounded-lg shadow-xl">
                      <h2 className='font-bold font-poppins text-xl text-center mb-3 md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-amber-800 via-amber-700 to-yellow-100'>{item.title}</h2>
                      <p className='text-white font-poppins font-light text-center text-md md:text-base'>{item.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center mx-4">
                    <div className="w-1 h-12 bg-gray-300"></div>
                    <div className="rounded-full bg-white p-2 my-2">
                      <CalendarIcon className='text-black w-6 h-6'/>
                    </div>
                    <div className="w-1 h-12 bg-gray-300"></div>
                  </div>
                  <div className="flex-1 w-full md:w-1/2 text-center">
                    <span className='text-3xl font-bold bg-gradient-to-r from-slate-600 via-zinc-700 to-stone-900 bg-clip-text text-transparent'>{item.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </>
    );
}