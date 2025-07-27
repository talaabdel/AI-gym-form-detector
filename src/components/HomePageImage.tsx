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
           {/* Background Image */}
           <img 
             src="/images/homepage.jpeg" 
             alt="Spot Me Sis Homepage" 
             className="absolute inset-0 w-full h-full object-cover"
           />
           
           {/* Gradient Overlay for better text readability */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20"></div>
           
           {/* Floating Decorative Elements */}
           <motion.div
             animate={{ 
               y: [0, -10, 0],
               rotate: [0, 5, 0]
             }}
             transition={{ 
               duration: 3, 
               repeat: Infinity, 
               ease: "easeInOut" 
             }}
             className="absolute top-8 right-8 text-pink-300 text-2xl z-40"
           >
             ✨
           </motion.div>
           

           
           {/* Enhanced Tagline */}
                       <div className="absolute top-24 left-0 right-0 flex justify-center z-50">
             <motion.div
               initial={{ opacity: 0, y: -20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1, duration: 0.8 }}
               className="text-center px-4"
               style={{
                 fontFamily: "'Great Vibes', 'Pacifico', 'Satisfy', cursive",
                 fontWeight: '400',
                 letterSpacing: '0.5px'
               }}
             >
                               <div className="text-5xl mb-3 font-bold text-gray-800 drop-shadow-lg">
                  Form <span className="text-pink-500">Snatched</span> 
                </div>
                <div className="text-5xl mb-3 font-bold text-gray-800 drop-shadow-lg">
  Confidence <span className="text-pink-500 drop-shadow-lg">Unmatched</span>
</div>

             </motion.div>
           </div>
           
                       {/* Enhanced Button */}
            <div className="absolute inset-0 flex items-start justify-center z-50" style={{ paddingTop: '75%' }}>
              <motion.button
                onClick={onGetStarted}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 40px rgba(168, 85, 247, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-200 text-purple-800 font-bold py-5 px-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-300 text-xl relative overflow-hidden group"
              >
                <span className="relative z-10">Get Started ✨</span>
                <div className="absolute inset-0 bg-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>
            </div>
           
           {/* Subtle Vignette Effect */}
           <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/10 pointer-events-none"></div>
         </div>
      </PhoneFrame>
    </div>
  );
}; 