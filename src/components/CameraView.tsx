import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { CoachPersonality, FormFeedback } from '../types';
import { feedbackMessages } from '../data/feedback';

interface CameraViewProps {
  coach: CoachPersonality;
  onFeedback: (feedback: FormFeedback) => void;
  currentExercise: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  coach,
  onFeedback,
  currentExercise
}) => {
  const {
    isLoading,
    isCameraReady,
    currentPose,
    videoRef,
    canvasRef,
    startCamera,
    detectPose,
    analyzeSquatForm
  } = usePoseDetection();

  useEffect(() => {
    startCamera();
  }, []);

  useEffect(() => {
    if (!isLoading && isCameraReady && currentPose) {
      const feedback = analyzeSquatForm(currentPose);
      if (feedback) {
        // Add personality to feedback
        const messages = feedbackMessages[coach.id as keyof typeof feedbackMessages];
        const personalizedMessage = messages[feedback.type][
          Math.floor(Math.random() * messages[feedback.type].length)
        ];
        
        onFeedback({
          ...feedback,
          message: personalizedMessage
        });
      }
    }
  }, [currentPose, coach.id, onFeedback, isLoading, isCameraReady]);

  useEffect(() => {
    if (!isCameraReady) return;

    const interval = setInterval(() => {
      detectPose();
    }, 100); // Detect pose every 100ms

    return () => clearInterval(interval);
  }, [detectPose, isCameraReady]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-pink-300 border-t-pink-600 rounded-full mb-4"
        />
        <p className="text-gray-700 font-medium">Loading AI bestie... ✨</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <video
          ref={videoRef}
          className="hidden"
          width={640}
          height={480}
          autoPlay
          playsInline
          muted
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-auto bg-black rounded-2xl"
        />
        
        {/* Coach indicator */}
        <div className={`absolute top-4 left-4 bg-gradient-to-r ${coach.color} px-4 py-2 rounded-full`}>
          <div className="flex items-center gap-2 text-white">
            <span className="text-lg">{coach.avatar}</span>
            <span className="font-medium text-sm">{coach.name}</span>
          </div>
        </div>

        {/* Exercise indicator */}
        <div className="absolute top-4 right-4 bg-black/50 px-4 py-2 rounded-full">
          <span className="text-white font-medium text-sm capitalize">
            {currentExercise}
          </span>
        </div>

        {/* Recording indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
          <span className="text-white text-sm font-medium">LIVE</span>
        </div>
      </div>
    </div>
  );
};