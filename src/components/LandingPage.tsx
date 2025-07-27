import React, { useState } from 'react';
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
  const [isLockedIn, setIsLockedIn] = useState(false);

  const handleLockIn = () => {
    setIsLockedIn(true);
  };

  return (
        <div className="h-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-5 flex flex-col">
      
      {/* Header with Logo and Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="flex items-center gap-4 mb-8"
      >
        <img 
          src="/images/logo.png" 
          alt="SMS Logo" 
          className="w-14 h-14 rounded-2xl shadow-lg border-2 border-white/50"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            SMS – Spot Me Sis
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your AI fitness bestie ✨</p>
        </div>
      </motion.div>

      {/* Main Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 mb-8 shadow-xl border border-purple-400/50"
      >
        <p className="text-white text-sm leading-relaxed opacity-95">
        Get instant feedback on your form, like having your bestie spot you over FaceTime!
        </p>
      </motion.div>

      {/* Locked In Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-5 mb-8 border border-purple-200/50 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base mb-1">Are you locked in for today?</h3>
            <p className="text-sm text-gray-600">Ready to crush your goals?</p>
          </div>
          <motion.div
            animate={{ scale: isLockedIn ? [1, 1.2, 1] : 1 }}
            transition={{ duration: 0.3 }}
            className="text-3xl mr-3"
          >
            {isLockedIn ? '🔒' : '🔓'}
          </motion.div>
        </div>
        
        {!isLockedIn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
            className="flex gap-3 mt-4"
          >
            <motion.button
              onClick={handleLockIn}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              Yes
            </motion.button>
            <motion.button
              onClick={handleLockIn}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              Hell Yes! 🔥
            </motion.button>
          </motion.div>
        )}
        
        {isLockedIn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mt-4 p-3 bg-gradient-to-r from-green-100 to-green-200 rounded-xl border border-green-300"
          >
            <p className="text-green-800 font-semibold text-sm text-center">
              Locked in and ready to slay! Let's get it! 💪
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Action Buttons */}
      <div className="space-y-4 flex-1">
        <motion.button
          onClick={onStartWorkout}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 text-gray-800 font-bold py-5 rounded-2xl shadow-lg border border-pink-300/50 hover:shadow-xl transition-all duration-300 text-lg"
        >
          Start Your Workout ✨
        </motion.button>

        <motion.button
          onClick={onViewProgress}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 text-gray-800 font-bold py-5 rounded-2xl shadow-lg border border-pink-300/50 hover:shadow-xl transition-all duration-300 text-lg"
        >
          View Your Progress 📊
        </motion.button>

        <motion.button
          onClick={onSetReminders}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          whileHover={{ scale: 1.02, y: -3 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-gradient-to-r from-pink-200 via-pink-100 to-pink-200 text-gray-800 font-bold py-5 rounded-2xl shadow-lg border border-pink-300/50 hover:shadow-xl transition-all duration-300 text-lg"
        >
          Set Daily Reminders ⏰
        </motion.button>
      </div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="text-center mt-6"
      >
        <p className="text-purple-600 text-sm font-medium">
          Made with 💗 for girls who want to feel<br />
          strong and confident!
        </p>
      </motion.footer>
    </div>
  );
}; 