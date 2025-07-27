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

      {/* Daily Check-in Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="bg-gradient-to-r from-purple-100 via-pink-100 to-purple-100 rounded-3xl p-5 mb-8 border border-purple-200/50 shadow-lg backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-800 text-base mb-1">Daily Check-in</h3>
            <p className="text-sm text-gray-600">How are you feeling today?</p>
          </div>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-green-100 to-green-200 text-green-600 text-lg font-bold border-2 border-green-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              😊
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600 text-lg font-bold border-2 border-yellow-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              😐
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full bg-gradient-to-br from-red-100 to-red-200 text-red-600 text-lg font-bold border-2 border-red-300 shadow-md hover:shadow-lg transition-all duration-200"
            >
              😔
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Main Feature Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="bg-gradient-to-br from-pink-500 via-pink-600 to-pink-500 rounded-3xl p-6 mb-8 shadow-xl border border-pink-400/50"
      >
        <div className="flex items-center gap-4 mb-4">
          <span className="text-3xl">💪</span>
          <h3 className="text-white font-bold text-xl">
            Camera-Based Form Detection
          </h3>
        </div>
        <p className="text-white text-sm leading-relaxed opacity-95">
          Get real-time feedback on your squat form, deadlifts, and more. Like having your bestie spot you through FaceTime!
        </p>
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
          className="w-full bg-gradient-to-r from-purple-500 via-purple-600 to-purple-500 text-white font-bold py-5 rounded-2xl shadow-lg border border-purple-400/50 hover:shadow-xl transition-all duration-300 text-lg"
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
          className="w-full bg-white text-gray-700 font-bold py-5 rounded-2xl shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all duration-300 text-lg hover:border-purple-200"
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
          className="w-full bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 text-white font-bold py-5 rounded-2xl shadow-lg border border-pink-400/50 hover:shadow-xl transition-all duration-300 text-lg"
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
        <p className="text-gray-500 text-sm font-medium">
          Made with 💗 for girls who want to feel strong and supported
        </p>
      </motion.footer>
    </div>
  );
}; 