import React from 'react';
import { motion } from 'framer-motion';
import { PhoneFrame } from './PhoneFrame';

interface HomePageImageProps {
  onGetStarted: () => void;
}

export const HomePageImage: React.FC<HomePageImageProps> = ({ onGetStarted }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <PhoneFrame>
        <div className="h-full w-full relative overflow-hidden">
                     <img 
             src="/images/homepage.jpeg" 
             alt="Spot Me Sis Homepage" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           
           {/* Tagline at the top */}
                       <div className="absolute top-16 left-0 right-0 flex justify-center z-50">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-black text-center px-4"
                style={{
                  fontFamily: "'Great Vibes', 'Pacifico', 'Satisfy', cursive",
                  fontWeight: '400',
                  letterSpacing: '0.5px'
                }}
              >
                <div className="text-5xl mb-2 font">
  Serving <span className="font-bold">Looks</span>
</div>
<div className="text-5xl mb-2 font">and</div>
<div className="text-5xl font-bold">Lunges</div>

              </motion.div>
            </div>
           
           <div className="absolute inset-0 flex items-center justify-center z-50">
             <motion.button
               onClick={onGetStarted}
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.3, duration: 0.6 }}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="bg-pink-500 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-lg"
             >
               Get Started ✨
             </motion.button>
           </div>
        </div>
      </PhoneFrame>
    </div>
  );
}; 