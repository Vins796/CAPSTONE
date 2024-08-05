import { motion } from 'framer-motion';
import bakery from '/bakery.jpg';
import { CalendarIcon } from '@heroicons/react/24/outline'

export default function About() {
    return (
      <motion.div 
        id="about-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className='relative'>
            <img src={bakery} alt="img" className="w-full h-auto lg:h-[700px] bg-cover bg-center bg-fixed bg-no-repeat" />
            <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
            <div className='absolute inset-x-0 bottom-0 flex flex-col justify-center items-center pb-8'>
                <h2 className='text-3xl text-white font-bold px-4 py-2 font-poppins'>
                    LA NOSTRA STORIA
                </h2>
                <div className='h-1 w-72 bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900'></div>
            </div>
        </div>
        <div className="mx-auto py-8 md:py-16 px-4 bg-[#dbdbdbee] w-full">
          <div className="flex flex-col space-y-8">

            <div className='flex flex-row gap-8 justify-center items-center'>
              <div>
                <span className='text-3xl font-bold bg-gradient-to-r from-slate-600 via-zinc-700 to-stone-900 bg-clip-text text-transparent'>1976</span>
              </div>
              <div>
                <CalendarIcon className='text-black w-6 h-6'/>
              </div>
              <div className='bg-gradient-to-b from-zinc-900 via-neutral-900 to-stone-900 p-4'>
                <h2 className='font-bold font-poppins text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900'>L'INIZIO</h2>
                <p className='text-white font-poppins font-light'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam cumque iusto earum hic ad magnam a quae soluta aspernatur quia?</p>
              </div>
            </div>

            <div className='flex flex-row-reverse gap-8 justify-center items-center'>
              <div>
                <span className='text-3xl font-bold bg-gradient-to-r from-slate-600 via-zinc-700 to-stone-900 bg-clip-text text-transparent'>1976</span>
              </div>
              <div>
                <CalendarIcon className='text-black w-6 h-6'/>
              </div>
              <div className='bg-gradient-to-b from-zinc-900 via-neutral-900 to-stone-900 p-4'>
                <h2 className='font-bold font-poppins text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900'>L'INIZIO</h2>
                <p className='text-white font-poppins font-light'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam cumque iusto earum hic ad magnam a quae soluta aspernatur quia?</p>
              </div>
            </div>

            <div className='flex flex-row gap-8 justify-center items-center'>
              <div>
                <span className='text-3xl font-bold bg-gradient-to-r from-slate-600 via-zinc-700 to-stone-900 bg-clip-text text-transparent'>1976</span>
              </div>
              <div>
                <CalendarIcon className='text-black w-6 h-6'/>
              </div>
              <div className='bg-gradient-to-b from-zinc-900 via-neutral-900 to-stone-900 p-4'>
                <h2 className='font-bold font-poppins text-2xl text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-violet-600 to-purple-900'>L'INIZIO</h2>
                <p className='text-white font-poppins font-light'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aliquam cumque iusto earum hic ad magnam a quae soluta aspernatur quia?</p>
              </div>
            </div>

            

          </div>
        </div>
      </motion.div>
    );
}