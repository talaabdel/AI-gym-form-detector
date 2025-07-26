import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { CoachSelector } from './components/CoachSelector';
import { CameraView } from './components/CameraView';
import { FeedbackBubble } from './components/FeedbackBubble';
import { ProgressTracker } from './components/ProgressTracker';
import { WorkoutControls } from './components/WorkoutControls';
import { CoachPersonality, FormFeedback, WorkoutSession, ProgressPhoto } from './types';

type AppView = 'coach-selection' | 'workout' | 'progress';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('coach-selection');
  const [selectedCoach, setSelectedCoach] = useState<CoachPersonality | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<FormFeedback | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [currentExercise] = useState('squat');

  const handleCoachSelect = (coach: CoachPersonality) => {
    setSelectedCoach(coach);
    setTimeout(() => setCurrentView('workout'), 500);
  };

  const handleFeedback = useCallback((feedback: FormFeedback) => {
    setCurrentFeedback(feedback);
    
    // Update session stats
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        totalReps: currentSession.totalReps + 1,
        goodReps: feedback.type === 'good' ? currentSession.goodReps + 1 : currentSession.goodReps
      };
      setCurrentSession(updatedSession);
    }

    // Clear feedback after delay
    setTimeout(() => setCurrentFeedback(null), 4000);
  }, [currentSession]);

  const startWorkout = () => {
    setIsWorkoutActive(true);
    setIsWorkoutPaused(false);
    
    if (!currentSession) {
      const newSession: WorkoutSession = {
        id: Date.now().toString(),
        startTime: Date.now(),
        exercise: currentExercise,
        coach: selectedCoach?.id || '',
        goodReps: 0,
        totalReps: 0,
        photos: []
      };
      setCurrentSession(newSession);
    }
  };

  const pauseWorkout = () => {
    setIsWorkoutPaused(true);
  };

  const stopWorkout = () => {
    setIsWorkoutActive(false);
    setIsWorkoutPaused(false);
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        endTime: Date.now()
      };
      setCurrentSession(updatedSession);
    }
  };

  const capturePhoto = () => {
    // In a real implementation, this would capture from the canvas
    const photo: ProgressPhoto = {
      id: Date.now().toString(),
      imageData: '/api/placeholder/150/150', // Placeholder
      exercise: currentExercise,
      timestamp: Date.now(),
      feedback: 'Perfect form captured!'
    };
    
    setProgressPhotos(prev => [...prev, photo]);
    
    if (currentSession) {
      const updatedSession = {
        ...currentSession,
        photos: [...currentSession.photos, photo]
      };
      setCurrentSession(updatedSession);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      <Toaster />
      
      {/* Header */}
      <header className="p-6 text-center">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-2"
        >
          SMS – Spot Me Sis ✨
        </motion.h1>
        <p className="text-gray-600 font-medium">
          Your AI bestie for perfect form & endless hype 💪
        </p>
      </header>

      <main className="container mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          {currentView === 'coach-selection' && (
            <motion.div
              key="coach-selection"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CoachSelector
                selectedCoach={selectedCoach}
                onSelectCoach={handleCoachSelect}
              />
            </motion.div>
          )}

          {currentView === 'workout' && selectedCoach && (
            <motion.div
              key="workout"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <CameraView
                    coach={selectedCoach}
                    onFeedback={handleFeedback}
                    currentExercise={currentExercise}
                  />
                  
                  <WorkoutControls
                    isActive={isWorkoutActive}
                    isPaused={isWorkoutPaused}
                    onStart={startWorkout}
                    onPause={pauseWorkout}
                    onStop={stopWorkout}
                    onCapture={capturePhoto}
                  />
                </div>

                <ProgressTracker
                  photos={progressPhotos}
                  currentSession={currentSession}
                />
              </div>

              {/* Navigation */}
              <div className="flex justify-center gap-4">
                <motion.button
                  onClick={() => setCurrentView('coach-selection')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-gray-700 rounded-full shadow-lg font-medium"
                >
                  Change Coach
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Feedback Bubble */}
      {selectedCoach && (
        <FeedbackBubble
          feedback={currentFeedback}
          coach={selectedCoach}
        />
      )}
    </div>
  );
}

export default App;