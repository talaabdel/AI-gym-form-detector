import React from 'react';
import { motion } from 'framer-motion';
import { ProgressPhoto, WorkoutSession } from '../types';
import { CameraIcon, TrophyIcon, FireIcon } from '@heroicons/react/24/outline';

interface ProgressTrackerProps {
  photos: ProgressPhoto[];
  currentSession: WorkoutSession | null;
  realTimeFormScore?: number;
  isInSquatPosition?: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  photos,
  currentSession,
  realTimeFormScore = 0,
  isInSquatPosition = false
}) => {
  const goodFormPhotos = photos.filter(p => p.feedback.includes('Perfect') || p.feedback.includes('good'));
  const totalReps = currentSession?.totalReps || 0;
  const goodReps = currentSession?.goodReps || 0;
  const formAccuracy = totalReps > 0 ? Math.round((goodReps / totalReps) * 100) : 0;

  // Use real-time form score when in squat position, otherwise use session accuracy
  const displayFormScore = isInSquatPosition ? realTimeFormScore : formAccuracy;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        <TrophyIcon className="w-6 h-6 text-yellow-500" />
        Your Progress ✨
      </h3>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl">
          <div className="text-2xl font-bold text-pink-600">{totalReps}</div>
          <div className="text-sm text-gray-600">Total Reps</div>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl relative">
          <div className={`text-2xl font-bold ${
            displayFormScore >= 90 ? 'text-green-600' : 
            displayFormScore >= 70 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {displayFormScore}%
          </div>
          <div className="text-sm text-gray-600">Form Score</div>
          {isInSquatPosition && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl">
          <div className="text-2xl font-bold text-purple-600">{goodFormPhotos.length}</div>
          <div className="text-sm text-gray-600">Perfect Shots</div>
        </div>
      </div>

      {/* Real-time Form Status */}
      {isInSquatPosition && (
        <div className="mb-4 p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-green-800">
              Live Form Analysis Active
            </span>
          </div>
          <p className="text-xs text-green-700 mt-1">
            {realTimeFormScore >= 90 ? "Perfect form! Keep it up! 🔥" :
             realTimeFormScore >= 70 ? "Good form! Try going deeper! 💪" :
             "Let's work on that form! You got this! ✨"}
          </p>
        </div>
      )}

      {/* Photo Gallery */}
      {goodFormPhotos.length > 0 && (
        <>
          <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <CameraIcon className="w-5 h-5" />
            Form Album 📸
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {goodFormPhotos.slice(-6).map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative aspect-square rounded-lg overflow-hidden bg-gray-100"
              >
                <img
                  src={photo.imageData}
                  alt="Perfect form"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                  <div className="text-white text-xs font-medium">
                    Perfect Form! 💪
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}

      {/* Motivational message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <FireIcon className="w-5 h-5 text-orange-500" />
          <span className="font-medium text-gray-800">Keep it up bestie!</span>
        </div>
        <p className="text-sm text-gray-600">
          {isInSquatPosition 
            ? (realTimeFormScore >= 90 ? "You're absolutely crushing it! Form goals! 🔥" :
               realTimeFormScore >= 70 ? "Great form! You're getting stronger! 💪" :
               "Focus on your form! You got this! ✨")
            : (formAccuracy >= 80 ? "You're absolutely crushing it! Form goals! 🔥" :
               formAccuracy >= 60 ? "Great progress! You're getting stronger every rep! 💪" :
               "Every rep is progress! Keep pushing, queen! ✨")
          }
        </p>
      </div>
    </div>
  );
};