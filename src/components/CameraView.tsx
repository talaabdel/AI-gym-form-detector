import React, { useEffect, useRef } from 'react';
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
  const lastFeedbackTime = useRef<number>(0);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  
  const {
    isLoading,
    isCameraReady,
    currentPose,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectPose,
    analyzeSquatForm
  } = usePoseDetection();

  useEffect(() => {
    // Add a small delay to ensure previous stream is fully stopped
    const timer = setTimeout(() => {
      startCamera();
    }, 100);
    
    // Cleanup function to stop camera when component unmounts or coach changes
    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [coach.id]); // Reinitialize when coach changes

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // Function to speak feedback with girly sassy voice
  const speakFeedback = (message: string) => {
    if (speechSynthesis.current) {
      // Remove emojis from the message before speaking
      const cleanMessage = message.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
      
      const utterance = new SpeechSynthesisUtterance(cleanMessage);
      utterance.rate = 1.2; // Slightly faster for sassy effect
      utterance.pitch = 1.3; // Higher pitch for girly voice
      utterance.volume = 0.8;
      
      // Try to find a female voice
      const voices = speechSynthesis.current.getVoices();
      let femaleVoice = voices.find(voice =>
        (voice.name.toLowerCase().includes('female') ||
         voice.name.toLowerCase().includes('woman') ||
         voice.name.toLowerCase().includes('samantha') ||
         voice.name.toLowerCase().includes('victoria') ||
         (voice.gender && voice.gender.toLowerCase() === 'female'))
      );
      if (!femaleVoice) {
        // fallback: pick the first voice marked as female
        femaleVoice = voices.find(voice => voice.gender && voice.gender.toLowerCase() === 'female');
      }
      if (!femaleVoice) {
        // fallback: pick the first voice with 'female' in the name
        femaleVoice = voices.find(voice => voice.name.toLowerCase().includes('female'));
      }
      if (!femaleVoice) {
        // fallback: pick the first available voice
        femaleVoice = voices[0];
      }
      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }
      speechSynthesis.current.speak(utterance);
    }
  };

  useEffect(() => {
    if (!isLoading && isCameraReady && currentPose) {
      const now = Date.now();
      const timeSinceLastFeedback = now - lastFeedbackTime.current;
      
      // Only give feedback every 10 seconds
      if (timeSinceLastFeedback >= 10000) {
        const feedback = analyzeSquatForm(currentPose);
        if (feedback) {
          // Add personality to feedback
          const messages = feedbackMessages[coach.id as keyof typeof feedbackMessages];
          const personalizedMessage = messages[feedback.type][
            Math.floor(Math.random() * messages[feedback.type].length)
          ];
          
          const feedbackWithMessage = {
            ...feedback,
            message: personalizedMessage
          };
          
          onFeedback(feedbackWithMessage);
          speakFeedback(personalizedMessage);
          lastFeedbackTime.current = now;
        }
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