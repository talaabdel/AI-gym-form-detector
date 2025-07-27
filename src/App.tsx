import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { CoachSelector } from './components/CoachSelector';
import { CameraView } from './components/CameraView';
import { FeedbackBubble } from './components/FeedbackBubble';
import { ProgressTracker } from './components/ProgressTracker';
import { WorkoutControls } from './components/WorkoutControls';
import { ProgressGallery } from './components/ProgressGallery';
import { ReminderSetup } from './components/ReminderSetup';
import { PhoneFrame } from './components/PhoneFrame';
import { LandingPage } from './components/LandingPage';
import { HomePageImage } from './components/HomePageImage';
import { CoachPersonality, FormFeedback, WorkoutSession, ProgressPhoto, ProgressView } from './types';

type AppView = 'homepage-image' | 'landing' | 'coach-selection' | 'workout' | 'progress' | 'progress-gallery' | 'reminder-setup';

function App() {
  const [currentView, setCurrentView] = useState<AppView>('homepage-image');
  const [selectedCoach, setSelectedCoach] = useState<CoachPersonality | null>(null);
  const [currentFeedback, setCurrentFeedback] = useState<FormFeedback | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isWorkoutPaused, setIsWorkoutPaused] = useState(false);
  const [currentSession, setCurrentSession] = useState<WorkoutSession | null>(null);
  const [progressPhotos, setProgressPhotos] = useState<ProgressPhoto[]>([]);
  const [currentExercise] = useState('squat');
  const [progressView, setProgressView] = useState<ProgressView>({ isOpen: false, selectedPhoto: null });
  const [reminderSetupOpen, setReminderSetupOpen] = useState(false);

  const handleStartWorkout = () => {
    setCurrentView('coach-selection');
  };

  const handleViewProgress = () => {
    setCurrentView('progress-gallery');
  };

  const handleGetStarted = () => {
    setCurrentView('landing');
  };

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

  // Add some demo photos for testing
  React.useEffect(() => {
    const demoPhotos: ProgressPhoto[] = [
      {
        id: '1',
        imageData: '/images/squat.png', // squats - your uploaded photo
        exercise: 'Squats',
        timestamp: Date.now() - 86400000, // 1 day ago
        feedback: 'Perfect squat form! Your depth is amazing! 💪'
      },
      {
        id: '2',
        imageData: '/images/glutebridge.png', // glute bridges - your uploaded photo
        exercise: 'Glute Bridges',
        timestamp: Date.now() - 172800000, // 2 days ago
        feedback: 'Excellent glute activation! Booty goals! 🍑'
      },
      {
        id: '3',
        imageData: '/images/pushup.png', // push-ups - your uploaded photo
        exercise: 'Push-ups',
        timestamp: Date.now() - 259200000, // 3 days ago
        feedback: 'Strong push-up form! You\'re getting stronger! 🔥'
      },
      {
        id: '4',
        imageData: '/images/plank.png', // planks - your uploaded photo
        exercise: 'Planks',
        timestamp: Date.now() - 345600000, // 4 days ago
        feedback: 'Perfect plank position! Core is on fire! 🔥'
      },
      {
        id: '5',
        imageData: '/images/lunges.png', // lunges - using the correct image
        exercise: 'Lunges',
        timestamp: Date.now() - 432000000, // 5 days ago
        feedback: 'Amazing lunge form! Your balance is incredible! ⚖️'
      },
      {
        id: '6',
        imageData: '/images/situp.png', // sit-ups - using the correct image
        exercise: 'Sit-ups',
        timestamp: Date.now() - 518400000, // 6 days ago
        feedback: 'Perfect sit-up technique! Core strength is building! 💪'
      }
    ];
    setProgressPhotos(demoPhotos);
  }, []);

    return (
    <>
      {currentView === 'homepage-image' ? (
        <HomePageImage onGetStarted={handleGetStarted} />
      ) : (
        <PhoneFrame>
          <div className="h-full bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 overflow-hidden">
            <Toaster />
            
                                                                        {/* Header - Only show on landing page */}
             

          <main className="h-full">
            <AnimatePresence mode="wait">
              {currentView === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage
                  onStartWorkout={handleStartWorkout}
                  onViewProgress={handleViewProgress}
                  onSetReminders={() => setCurrentView('reminder-setup')}
                />
              </motion.div>
            )}

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
                className="px-4 pb-16 h-full overflow-hidden pt-6"
              >
                {/* Navigation - Moved to top */}
                <div className="flex justify-center gap-4 mb-6">
                  <motion.button
                    onClick={() => setCurrentView('coach-selection')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-pink-200 text-pink-800 border border-pink-300 rounded-full shadow-lg font-medium text-sm"
                  >
                    ← Back to Coaches
                  </motion.button>
                  <motion.button
                    onClick={() => setCurrentView('landing')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white text-gray-700 rounded-full shadow-lg font-medium text-sm"
                  >
                    Back to Home
                  </motion.button>
                </div>

                <div className="space-y-6">
                  <CameraView
                    key={selectedCoach.id} // Force re-initialization when coach changes
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

                  <ProgressTracker
                    photos={progressPhotos}
                    currentSession={currentSession}
                  />
                </div>
              </motion.div>
            )}

                         {currentView === 'progress-gallery' && (
               <motion.div
                 key="progress-gallery"
                 initial={{ opacity: 0, x: 300 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -300 }}
                 transition={{ duration: 0.3 }}
                 className="h-full overflow-hidden"
               >
                 <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
                   <motion.button
                     onClick={() => setCurrentView('landing')}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="px-3 py-1.5 bg-pink-200 text-pink-800 border border-pink-300 rounded-full shadow-sm font-medium text-xs"
                   >
                     ← Back
                   </motion.button>
                   <h2 className="text-lg font-bold text-gray-800">Progress Gallery 📊</h2>
                   <div className="w-12"></div>
                 </div>
                 <div className="h-full overflow-y-auto">
                   <ProgressGallery
                     photos={progressPhotos}
                     isOpen={true}
                     onClose={() => setCurrentView('landing')}
                     selectedPhoto={progressView.selectedPhoto}
                     onSelectPhoto={(photo) => setProgressView({ ...progressView, selectedPhoto: photo })}
                   />
                 </div>
               </motion.div>
             )}

                         {currentView === 'reminder-setup' && (
               <motion.div
                 key="reminder-setup"
                 initial={{ opacity: 0, x: 300 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -300 }}
                 transition={{ duration: 0.3 }}
                 className="h-full overflow-hidden"
               >
                 <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-white">
                   <motion.button
                     onClick={() => setCurrentView('landing')}
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="px-3 py-1.5 bg-pink-200 text-pink-800 border border-pink-300 rounded-full shadow-sm font-medium text-xs"
                   >
                     ← Back
                   </motion.button>
                   <h2 className="text-lg font-bold text-gray-800">Daily Reminders ⏰</h2>
                   <div className="w-12"></div>
                 </div>
                 <div className="h-full overflow-y-auto">
                   <ReminderSetup
                     isOpen={true}
                     onClose={() => setCurrentView('landing')}
                   />
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
     </PhoneFrame>
       )}
     </>
   );
 }

export default App;