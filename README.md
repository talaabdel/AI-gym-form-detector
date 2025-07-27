# 💪 Spot Me Sis - AI Fitness Bestie

A revolutionary mobile fitness app that provides real-time AI-powered form detection and personalized coaching to help women achieve their fitness goals with confidence and support.

## 🌟 What This App Does

**Spot Me Sis** is your AI fitness bestie that combines computer vision technology with personalized coaching to revolutionize your workout experience. 
Think of it as having your best friend spot you through FaceTime, but with AI superpowers!

### ✨ Key Features

- **🎥 Real-time Form Detection**: AI-powered camera analysis that watches your form and provides instant feedback
- **👯‍♀️ Personalized AI Coaches**: Choose from different coach personalities (Soft Girl Encourager, Tough Love Bestie, etc.)
- **📸 Progress Gallery**: Track your fitness journey with a beautiful photo gallery of your best forms
- **⏰ Smart Reminders**: Set personalized workout reminders with motivational messages
- **🔒 Daily Lock-in**: Interactive feature to commit to your daily fitness goals
- **📊 Progress Tracking**: Monitor your reps, form scores, and perfect shots

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Beautiful toast notifications

### AI & Computer Vision
- **TensorFlow.js** - Machine learning library for pose detection
- **MediaPipe** - Google's pose detection model for real-time body tracking
- **WebRTC** - Camera access and video streaming

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting

### Core Components

#### 🏠 Landing Page (`LandingPage.tsx`)
- Welcome screen with app introduction
- "Locked In" feature for daily commitment
- Navigation to main features

#### 🎥 Camera View (`CameraView.tsx`)
- Real-time camera feed with pose detection
- AI form analysis and feedback
- Coach personality integration

#### 👯‍♀️ Coach Selector (`CoachSelector.tsx`)
- Choose your AI coach personality
- Different coaching styles and feedback tones

#### 📊 Progress Gallery (`ProgressGallery.tsx`)
- Photo gallery of your workout progress
- Form feedback and timestamps
- Encouraging messages

#### ⏰ Reminder Setup (`ReminderSetup.tsx`)
- Set daily workout reminders
- Customizable motivational messages
- SMS notification demo

#### 🎮 Workout Controls (`WorkoutControls.tsx`)
- Start, pause, and stop workout sessions
- Photo capture functionality
- Session management

### Key Features Explained

#### 🤖 AI Pose Detection
The app uses MediaPipe's pose detection model to analyze your form in real-time:
- **Squat Analysis**: Tracks knee angles, hip position, and depth
- **Form Scoring**: Provides percentage-based form quality scores
- **Real-time Feedback**: Instant coaching based on your movements

#### 👯‍♀️ Coach Personalities
Choose from different AI coach styles:
- **Soft Girl Encourager** 🌸: Gentle, supportive coaching
- **Tough Love Bestie** 💪: Direct, motivational feedback
- **Technical Trainer** 📊: Detailed form analysis

#### 📸 Progress Tracking
- **Photo Capture**: Save your best forms automatically
- **Form Album**: Visual progress gallery with timestamps
- **Achievement Tracking**: Monitor perfect reps and improvements
