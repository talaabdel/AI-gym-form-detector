import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { coaches } from '../data/coaches';
import { CoachPersonality } from '../types';
import { AnimatePresence } from 'framer-motion';

interface CoachSelectorProps {
  selectedCoach: CoachPersonality | null;
  onSelectCoach: (coach: CoachPersonality) => void;
}

const exercises = [
  { id: 'squat', name: 'Squats', emoji: '🏋️' },
  { id: 'pushup', name: 'Push-ups', emoji: '💪' },
  { id: 'plank', name: 'Planks', emoji: '🧘' },
  { id: 'glutebridge', name: 'Glute Bridges', emoji: '🍑' },
  { id: 'deadlift', name: 'Deadlifts', emoji: '🏋️‍♀️' },
  { id: 'lunges', name: 'Lunges', emoji: '🚶' }
];

export const CoachSelector: React.FC<CoachSelectorProps> = ({
  selectedCoach,
  onSelectCoach
}) => {
  const [selectedExercise, setSelectedExercise] = useState('squat');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="h-full flex flex-col p-4">
      {/* Header Section */}
      <div className="text-center mb-3 pt-1">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Choose Your Vibe ✨
        </h2>
        <p className="text-gray-600 text-xs">
          Pick your AI bestie to spot you through your workout!
        </p>
      </div>

      {/* Exercise Dropdown */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Exercise:
        </label>
        <div className="relative">
          <motion.button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-left shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-between"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">
                {exercises.find(ex => ex.id === selectedExercise)?.emoji}
              </span>
              <span className="font-medium text-gray-800">
                {exercises.find(ex => ex.id === selectedExercise)?.name}
              </span>
            </div>
            <motion.span
              animate={{ rotate: isDropdownOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-gray-500"
            >
              ▼
            </motion.span>
          </motion.button>

          <AnimatePresence>
            {isDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-xl shadow-lg z-10 max-h-48 overflow-y-auto"
              >
                {exercises.map((exercise) => (
                  <motion.button
                    key={exercise.id}
                    onClick={() => {
                      setSelectedExercise(exercise.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 flex items-center gap-3 ${
                      selectedExercise === exercise.id ? 'bg-pink-50 text-pink-600' : 'text-gray-700'
                    }`}
                    whileHover={{ backgroundColor: selectedExercise === exercise.id ? '#fdf2f8' : '#f9fafb' }}
                  >
                    <span className="text-lg">{exercise.emoji}</span>
                    <span className="font-medium">{exercise.name}</span>
                    {selectedExercise === exercise.id && (
                      <span className="ml-auto text-pink-500">✓</span>
                    )}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Coach Cards Section */}
      <div className="flex-1 flex flex-col justify-center gap-4">
        {coaches.map((coach, index) => (
          <motion.button
            key={coach.id}
            onClick={() => onSelectCoach(coach)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className={`p-4 rounded-2xl text-left transition-all duration-300 ${
              selectedCoach?.id === coach.id
                ? 'ring-4 ring-pink-300 shadow-xl scale-105'
                : 'hover:shadow-lg hover:scale-102'
            }`}
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`bg-gradient-to-r ${coach.color} p-4 rounded-xl text-white`}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{coach.avatar}</span>
                <div>
                  <h3 className="text-base font-bold">{coach.name}</h3>
                  <p className="text-white/80 text-xs">{coach.description}</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-3 mt-2">
                <p className="text-xs font-medium">Sample motivation:</p>
                <p className="text-xs italic mt-1">
                  {coach.id === 'soft-girl' && "You're doing amazing, even if that squat was 2/10 💕"}
                  {coach.id === 'tough-love' && "You're folding like a lawn chair, fix that back! 🔥"}
                  {coach.id === 'gym-mom' && "Protect your knees, sweetie. And hydrate 💜"}
                </p>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="h-2"></div>
    </div>
  );
};