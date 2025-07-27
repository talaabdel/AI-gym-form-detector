import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { usePoseDetection } from '../hooks/usePoseDetection';
import { CoachPersonality, FormFeedback } from '../types';
import { feedbackMessages } from '../data/feedback';

interface CameraViewProps {
  coach: CoachPersonality;
  onFeedback: (feedback: FormFeedback) => void;
  onFormUpdate: (score: number, inSquatPosition: boolean) => void;
  currentExercise: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  coach,
  onFeedback,
  onFormUpdate,
  currentExercise
}) => {
  const lastFeedbackTime = useRef<number>(0);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  
  const {
    isLoading,
    isCameraReady,
    currentPose,
    formScore,
    isInExercisePosition,
    currentExercise: detectedExercise,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectPose,
    analyzeForm,
    setExercise
  } = usePoseDetection();

  useEffect(() => {
    // Set the exercise when component mounts or exercise changes
    setExercise(currentExercise);
  }, [currentExercise, setExercise]);

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
         voice.name.toLowerCase().includes('victoria'))
      );
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
    if (!isLoading && isCameraReady && currentPose && currentPose.poseLandmarks) {
      const now = Date.now();
      const timeSinceLastFeedback = now - lastFeedbackTime.current;
      
      // Update form data in parent component
      onFormUpdate(formScore, isInExercisePosition);
      
      // Only give feedback every 3 seconds and when in squat position
      if (timeSinceLastFeedback >= 3000 && isInExercisePosition) {
        const feedback = analyzeForm(currentPose.poseLandmarks, currentExercise);
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
  }, [currentPose, coach.id, onFeedback, onFormUpdate, isLoading, isCameraReady, isInExercisePosition, formScore]);

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
          style={{ transform: 'scaleX(-1)' }} // Mirror the video
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="w-full h-auto bg-black rounded-2xl"
          style={{ transform: 'scaleX(-1)' }} // Mirror the canvas to match video
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

        {/* Form Score Display */}
        {isInExercisePosition && (
          <div className="absolute top-16 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-800">Form Score:</span>
              <span className={`text-lg font-bold ${
                formScore >= 90 ? 'text-green-600' : 
                formScore >= 70 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {formScore}%
              </span>
            </div>
          </div>
        )}

        {/* Squat Position Indicator */}
        {isInExercisePosition && (
          <div className="absolute bottom-16 left-4 bg-green-500/90 backdrop-blur-sm px-3 py-2 rounded-full">
            <div className="flex items-center gap-2 text-white">
              <span className="text-sm">🦵 In {currentExercise} Position</span>
            </div>
          </div>
        )}

        {/* Recording indicator */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <motion.div
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-3 h-3 bg-red-500 rounded-full"
          />
          <span className="text-white text-sm font-medium">LIVE</span>
        </div>

        {/* Camera not ready message */}
        {!isCameraReady && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="text-4xl mb-2">📷</div>
              <p className="text-sm">Camera starting up...</p>
              <p className="text-xs mt-2 opacity-75">Please allow camera access</p>
            </div>
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="absolute top-20 left-4 bg-black/70 text-white text-xs p-2 rounded">
            <div>Camera: {isCameraReady ? '✅ Ready' : '❌ Loading'}</div>
            <div>Pose: {currentPose ? '✅ Detected' : '❌ None'}</div>
            <div>Score: {formScore}%</div>
            <div>{currentExercise}: {isInExercisePosition ? '✅ Yes' : '❌ No'}</div>
          </div>
        )}
      </div>
    </div>
  );
};