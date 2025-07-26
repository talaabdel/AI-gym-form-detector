import React from 'react';
import { motion } from 'framer-motion';
import { coaches } from '../data/coaches';
import { CoachPersonality } from '../types';

interface CoachSelectorProps {
  selectedCoach: CoachPersonality | null;
  onSelectCoach: (coach: CoachPersonality) => void;
}

export const CoachSelector: React.FC<CoachSelectorProps> = ({
  selectedCoach,
  onSelectCoach
}) => {
  return (
    <div className="h-full flex flex-col p-3 pt-8">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-1">
          Choose Your Vibe ✨
        </h2>
        <p className="text-gray-600 text-xs">
          Pick your AI bestie to spot you through your workout!
        </p>
      </div>

      <div className="flex-1 grid gap-4">
        {coaches.map((coach) => (
          <motion.button
            key={coach.id}
            onClick={() => onSelectCoach(coach)}
            className={`p-4 rounded-2xl text-left transition-all duration-300 ${
              selectedCoach?.id === coach.id
                ? 'ring-4 ring-pink-300 shadow-xl scale-105'
                : 'hover:shadow-lg hover:scale-102'
            }`}
            style={{
              background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className={`bg-gradient-to-r ${coach.color} p-3 rounded-2xl text-white`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{coach.avatar}</span>
                <div>
                  <h3 className="text-base font-bold">{coach.name}</h3>
                  <p className="text-white/80 text-xs">{coach.description}</p>
                </div>
              </div>
              
              <div className="bg-white/20 rounded-lg p-2 mt-1">
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
    </div>
  );
};