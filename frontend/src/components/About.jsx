import image from '../assets/img.jpg';
import { CalendarIcon } from '@heroicons/react/24/outline'

const TimelineItem = ({ year, title, description, isLeft }) => (
    <div className={`flex flex-col md:flex-row-reverse justify-center items-center md:items-start mb-8 md:mb-16 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
      <div className={`w-full md:w-5/12 order-2 md:order-none px-4 mb-4 md:mb-0 ${isLeft ? 'md:text-right' : ''}`}>
        <div className="bg-[#352824] p-4 md:p-6 rounded-lg">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-white text-sm md:text-base">{description}</p>
        </div>
      </div>
      <div className="flex items-center justify-center md-flex-row-reverse w-full md:w-2/12 order-1 md:order-none mb-4 md:mb-0">
        <div className="bg-red-600 rounded-full p-2 flex-shrink-0">
          <CalendarIcon className="h-6 w-6 text-white" />
        </div>
        <div className="md:hidden ml-4">
          <h4 className="text-3xl font-bold text-red-600">{year}</h4>
        </div>
      </div>
      <div className={`hidden md:block w-5/12 px-4 ${isLeft ? 'md:text-left' : 'md:text-right'}`}>
        <h4 className="text-5xl font-bold text-red-600">{year}</h4>
      </div>
    </div>
);

export default function About() {
    return (
      <>
        <div className='relative'>
            <img src={image} alt="img" className="w-full h-auto lg:h-[600px] object-cover" />
            <div className='absolute inset-0 bg-gradient-to-t from-black to-transparent'></div>
            <div className='absolute inset-x-0 bottom-0 flex justify-center items-center pb-8'>
                <h2 className='text-3xl text-white font-bold px-4 py-2 font-poppins border-b-[3px] border-red-500 pb-4'>
                    LA NOSTRA STORIA
                </h2>
            </div>
        </div>
        <div className="container mx-auto py-8 md:py-16 px-4">
        <div className="space-y-8 md:space-y-16">
          <TimelineItem
            year="1976"
            title="L'INIZIO"
            description="Clara ed Annibale Ficini acquistano la rivendita di pane in via Berthollet, 30. Dopo una vita di ristorazione in una trattoria in Piazza Madama Cristina, l'attuale pizzeria il Rospetto, decidono di reinventarsi in una nuova attività: una rivendita di pane."
            isLeft={true}
          />
          <TimelineItem
            year="1976"
            title="L'INIZIO"
            description="Clara ed Annibale Ficini acquistano la rivendita di pane in via Berthollet, 30. Dopo una vita di ristorazione in una trattoria in Piazza Madama Cristina, l'attuale pizzeria il Rospetto, decidono di reinventarsi in una nuova attività: una rivendita di pane."
            isLeft={true}
          />
          <TimelineItem
            year="1976"
            title="L'INIZIO"
            description="Clara ed Annibale Ficini acquistano la rivendita di pane in via Berthollet, 30. Dopo una vita di ristorazione in una trattoria in Piazza Madama Cristina, l'attuale pizzeria il Rospetto, decidono di reinventarsi in una nuova attività: una rivendita di pane."
            isLeft={true}
          />
          <TimelineItem
            year="1976"
            title="L'INIZIO"
            description="Clara ed Annibale Ficini acquistano la rivendita di pane in via Berthollet, 30. Dopo una vita di ristorazione in una trattoria in Piazza Madama Cristina, l'attuale pizzeria il Rospetto, decidono di reinventarsi in una nuova attività: una rivendita di pane."
            isLeft={true}
          />
        </div>
      </div>
      </>
    );
}