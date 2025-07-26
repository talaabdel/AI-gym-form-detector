import React from 'react';
import { motion } from 'framer-motion';

interface LandingPageProps {
  onStartWorkout: () => void;
  onViewProgress: () => void;
  onSetReminders: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartWorkout,
  onViewProgress,
  onSetReminders
}) => {
  return (
    <div className="h-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">

             {/* Main Feature Card */}
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.2 }}
         className="bg-pink-500 rounded-2xl p-4 mb-4 shadow-lg border border-pink-600"
       >
         <div className="flex items-center gap-2 mb-2">
           <span className="text-2xl">💪</span>
           <span className="text-2xl">❤️</span>
         </div>
         <h3 className="text-white font-bold text-lg mb-2">
           Camera-Based Form Detection
         </h3>
         <p className="text-white text-sm">
           Get real-time feedback on your squat form, deadlifts, and more. Like having your bestie spot you through FaceTime!
         </p>
       </motion.div>

      {/* Feature Cards */}
      <div className="space-y-3 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">🔥</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Choose Your Vibe</h4>
              <p className="text-gray-600 text-xs">Soft encourager, tough love, or wise gym mom</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">📸</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Perfect Form Album</h4>
              <p className="text-gray-600 text-xs">Auto-capture your best form moments</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <div>
              <h4 className="font-bold text-gray-800 text-sm">Empowering Feedback</h4>
              <p className="text-gray-600 text-xs">Build strength physically and emotionally</p>
            </div>
          </div>
        </motion.div>
      </div>

             {/* Action Buttons */}
       <div className="space-y-3">
                   <motion.button
            onClick={onStartWorkout}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-purple-200 text-purple-800 font-bold py-3 rounded-xl shadow-lg border border-purple-300"
          >
            Start Your Workout ✨
          </motion.button>

         <motion.button
           onClick={onViewProgress}
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.7 }}
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           className="w-full bg-white text-gray-700 font-bold py-3 rounded-xl shadow-lg border border-gray-200"
         >
           View Your Progress 📊
         </motion.button>

                   <motion.button
            onClick={onSetReminders}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-pink-200 text-pink-800 font-bold py-3 rounded-xl shadow-lg border border-pink-300"
          >
            Set Daily Reminders ⏰
          </motion.button>
       </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-6"
      >
        <p className="text-gray-600 text-xs">
          Made with 💗 for girls who want to feel strong and supported
        </p>
      </motion.footer>
    </div>
  );
}; 