import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, PauseIcon, StopIcon, CameraIcon } from '@heroicons/react/24/outline';

interface WorkoutControlsProps {
  isActive: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPause: () => void;
  onStop: () => void;
  onCapture: () => void;
}

export const WorkoutControls: React.FC<WorkoutControlsProps> = ({
  isActive,
  isPaused,
  onStart,
  onPause,
  onStop,
  onCapture
}) => {
  return (
    <div className="flex items-center justify-center gap-4 p-4">
      {!isActive ? (
        <motion.button
          onClick={onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-8 py-4 rounded-full font-semibold shadow-lg flex items-center gap-2"
        >
          <PlayIcon className="w-6 h-6" />
          Start Workout ✨
        </motion.button>
      ) : (
        <div className="flex items-center gap-3">
          <motion.button
            onClick={isPaused ? onStart : onPause}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white p-4 rounded-full shadow-lg"
          >
            {isPaused ? <PlayIcon className="w-6 h-6" /> : <PauseIcon className="w-6 h-6" />}
          </motion.button>

          <motion.button
            onClick={onCapture}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-full shadow-lg"
          >
            <CameraIcon className="w-6 h-6" />
          </motion.button>

          <motion.button
            onClick={onStop}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-full shadow-lg"
          >
            <StopIcon className="w-6 h-6" />
          </motion.button>
        </div>
      )}
    </div>
  );
};