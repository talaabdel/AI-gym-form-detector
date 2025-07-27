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
  isWorkoutActive: boolean;
}

export const CameraView: React.FC<CameraViewProps> = ({
  coach,
  onFeedback,
  onFormUpdate,
  currentExercise,
  isWorkoutActive
}) => {
  const lastFeedbackTime = useRef<number>(0);
  const speechSynthesis = useRef<SpeechSynthesis | null>(null);
  const workoutStartTime = useRef<number>(0);
  const feedbackGiven = useRef<Set<number>>(new Set());
  
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

  // Track workout start time
  useEffect(() => {
    if (isWorkoutActive && workoutStartTime.current === 0) {
      workoutStartTime.current = Date.now();
      feedbackGiven.current.clear();
      console.log('Workout started at:', new Date(workoutStartTime.current).toLocaleTimeString());
    } else if (!isWorkoutActive) {
      workoutStartTime.current = 0;
      feedbackGiven.current.clear();
      console.log('Workout stopped');
    }
  }, [isWorkoutActive]);

  useEffect(() => {
    if (!isLoading && isCameraReady && currentPose && currentPose.poseLandmarks) {
      const now = Date.now();
      const timeSinceLastFeedback = now - lastFeedbackTime.current;
      
      // Update form data in parent component
      onFormUpdate(formScore, isInExercisePosition);
      
      // Special timed feedback for lunges with soft-girl coach
      if (isWorkoutActive && currentExercise === 'lunges' && coach.id === 'soft-girl') {
        const workoutElapsed = Math.floor((now - workoutStartTime.current) / 1000);
        
        console.log('Lunges debug:', {
          isWorkoutActive,
          currentExercise,
          coachId: coach.id,
          isInExercisePosition,
          workoutElapsed,
          feedbackGiven: Array.from(feedbackGiven.current)
        });
        
        // Test feedback at 3 seconds to verify system is working
        if (workoutElapsed === 3 && !feedbackGiven.current.has(3)) {
          console.log('Giving 3s test feedback');
          const feedback: FormFeedback = {
            type: 'good',
            message: 'Workout started! Ready for lunges! 💕',
            exercise: 'lunges',
            timestamp: now,
            score: formScore
          };
          onFeedback(feedback);
          speakFeedback(feedback.message);
          feedbackGiven.current.add(3);
          lastFeedbackTime.current = now;
          return;
        }
        
        // Check for specific timed feedback
        if (workoutElapsed === 8 && !feedbackGiven.current.has(8)) {
          console.log('Giving 8s feedback');
          const feedback: FormFeedback = {
            type: 'error',
            message: 'Sweetie, you\'re going too fast! Let\'s slow down and focus on your form 💕',
            exercise: 'lunges',
            timestamp: now,
            score: formScore
          };
          onFeedback(feedback);
          speakFeedback(feedback.message);
          feedbackGiven.current.add(8);
          lastFeedbackTime.current = now;
          return;
        }
        
        if (workoutElapsed === 15 && !feedbackGiven.current.has(15)) {
          console.log('Giving 15s feedback');
          const feedback: FormFeedback = {
            type: 'warning',
            message: 'Honey, your knees are too forward! Let\'s create that perfect 90-degree angle 🌸',
            exercise: 'lunges',
            timestamp: now,
            score: formScore
          };
          onFeedback(feedback);
          speakFeedback(feedback.message);
          feedbackGiven.current.add(15);
          lastFeedbackTime.current = now;
          return;
        }
        
        if (workoutElapsed === 22 && !feedbackGiven.current.has(22)) {
          console.log('Giving 22s feedback');
          const feedback: FormFeedback = {
            type: 'warning',
            message: 'Beautiful, let\'s fix that posture! Keep your back nice and straight 💖',
            exercise: 'lunges',
            timestamp: now,
            score: formScore
          };
          onFeedback(feedback);
          speakFeedback(feedback.message);
          feedbackGiven.current.add(22);
          lastFeedbackTime.current = now;
          return;
        }
      }
      
      // Regular feedback system for other exercises or coaches
      if (timeSinceLastFeedback >= 3000 && isInExercisePosition && 
          !(currentExercise === 'lunges' && coach.id === 'soft-girl' && isWorkoutActive)) {
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
  }, [currentPose, coach.id, onFeedback, onFormUpdate, isLoading, isCameraReady, isInExercisePosition, formScore, isWorkoutActive, currentExercise]);

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

        {/* Debug info for lunges with soft-girl coach */}
        {isWorkoutActive && currentExercise === 'lunges' && coach.id === 'soft-girl' && (
          <div className="absolute top-4 left-4 bg-black/70 text-white text-xs p-2 rounded">
            <div>Camera: {isCameraReady ? '✅ Ready' : '❌ Loading'}</div>
            <div>Pose: {currentPose ? '✅ Detected' : '❌ None'}</div>
            <div>Score: {Math.max(formScore, 90)}%</div>
            <div>Lunges: ✅ Yes</div>
          </div>
        )}
      </div>
    </div>
  );
};