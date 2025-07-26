import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormFeedback, CoachPersonality } from '../types';
import toast from 'react-hot-toast';

interface FeedbackBubbleProps {
  feedback: FormFeedback | null;
  coach: CoachPersonality;
}

export const FeedbackBubble: React.FC<FeedbackBubbleProps> = ({
  feedback,
  coach
}) => {
  useEffect(() => {
    if (feedback) {
      const toastConfig = {
        duration: 3000,
        position: 'top-center' as const,
        style: {
          background: feedback.type === 'good' ? '#10B981' : 
                     feedback.type === 'warning' ? '#F59E0B' : '#EF4444',
          color: 'white',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500'
        }
      };

      toast(feedback.message, toastConfig);
    }
  }, [feedback]);

  return (
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`bg-gradient-to-r ${coach.color} p-4 rounded-2xl shadow-2xl max-w-sm mx-4`}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{coach.avatar}</span>
              <div className="flex-1">
                <p className="text-white font-medium text-sm leading-relaxed">
                  {feedback.message}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${
                    feedback.type === 'good' ? 'bg-green-300' :
                    feedback.type === 'warning' ? 'bg-yellow-300' : 'bg-red-300'
                  }`} />
                  <span className="text-white/80 text-xs">
                    {feedback.type === 'good' ? 'Perfect!' : 
                     feedback.type === 'warning' ? 'Almost there!' : 'Needs work!'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};