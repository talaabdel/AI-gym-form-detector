# 💪 Spot Me Sis - AI Fitness Bestie

SMS is a mobile fitness app that provides real-time AI-powered form detection and personalized coaching to help women achieve their fitness goals with confidence and support.

## 🌟 What This App Does

**Spot Me Sis** is your AI fitness bestie that combines computer vision technology with personalized coaching to revolutionize your workout experience. Think of it as having your best friend spot you through FaceTime, but with AI superpowers!

### ✨ Key Features

- **🎥 Real-time Form Detection**: AI-powered camera analysis that watches your form and provides instant feedback
- **👯‍♀️ Personalized AI Coaches**: Choose from different coach personalities (Soft Girl Encourager, Tough Love Bestie, etc.)
- **📸 Progress Gallery**: Track your fitness journey with a beautiful photo gallery of your best forms
- **⏰ Smart Reminders**: Set personalized workout reminders with motivational messages
- **🔒 Daily Lock-in**: Interactive feature to commit to your daily fitness goals
- **📊 Progress Tracking**: Monitor your reps, form scores, and perfect shots

## 🎥 Camera & Form Detection

### **Real-time AI Analysis**
The app now features **MediaPipe pose detection** for accurate, real-time form analysis:

- **🦵 Squat Detection**: Automatically detects when you're in a squat position
- **📊 Form Scoring**: Real-time form accuracy scoring (0-100%)
- **🎯 Angle Analysis**: Analyzes knee angles, hip position, and squat depth
- **💬 Instant Feedback**: Provides personalized coaching based on your form

### **How to Test the Camera**
1. **Allow Camera Access**: When prompted, allow the app to access your camera
2. **Position Yourself**: Stand 6-8 feet from the camera, facing it
3. **Start Squatting**: Begin performing squats - the app will detect your position
4. **Watch for Feedback**: Real-time form score and coaching messages will appear
5. **Perfect Your Form**: Follow the AI's guidance to improve your squat technique

### **Form Analysis Features**
- **Squat Depth**: Ensures you're going deep enough for proper form
- **Knee Alignment**: Checks that knees don't go past your toes
- **Hip Position**: Monitors proper hip hinge and back position
- **Real-time Scoring**: Live form accuracy percentage
- **Visual Feedback**: Pose skeleton overlay on camera feed

## 🛠️ Technologies Used

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Tailwind CSS** - Utility-first CSS framework for rapid UI development
- **Framer Motion** - Smooth animations and transitions
- **React Hot Toast** - Beautiful toast notifications

### AI & Computer Vision
- **MediaPipe Pose** - Google's advanced pose detection model
- **TensorFlow.js** - Machine learning library for pose detection
- **WebRTC** - Camera access and video streaming

### Development Tools
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with camera access
- **HTTPS connection** (required for camera access in production)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/spot-me-sis.git
   cd spot-me-sis
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

5. **Test Camera Functionality**
   - Click "Start Your Workout"
   - Choose a coach
   - Allow camera access when prompted
   - Position yourself and start squatting!

## 📱 App Structure

### Core Components

#### 🏠 Landing Page (`LandingPage.tsx`)
- Welcome screen with app introduction
- "Locked In" feature for daily commitment
- Navigation to main features

#### 🎥 Camera View (`CameraView.tsx`)
- Real-time camera feed with MediaPipe pose detection
- AI form analysis and feedback
- Coach personality integration
- Live form scoring display

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
The app uses MediaPipe's advanced pose detection model to analyze your form in real-time:
- **Squat Analysis**: Tracks knee angles, hip position, and depth
- **Form Scoring**: Provides percentage-based form quality scores
- **Real-time Feedback**: Instant coaching based on your movements
- **Visual Overlay**: Pose skeleton displayed on camera feed

#### 👯‍♀️ Coach Personalities
Choose from different AI coach styles:
- **Soft Girl Encourager** 🌸: Gentle, supportive coaching
- **Tough Love Bestie** 💪: Direct, motivational feedback
- **Technical Trainer** 📊: Detailed form analysis

#### 📸 Progress Tracking
- **Photo Capture**: Save your best forms automatically
- **Form Album**: Visual progress gallery with timestamps
- **Achievement Tracking**: Monitor perfect reps and improvements
- **Real-time Stats**: Live form score and session metrics

## 🎨 Design System

### Color Palette
- **Primary**: Pink (`#EC4899`) and Purple (`#8B5CF6`)
- **Secondary**: Indigo (`#6366F1`) and Emerald (`#10B981`)
- **Neutral**: Gray scale for text and backgrounds

### Typography
- **Headings**: Bold, gradient text with brand colors
- **Body**: Clean, readable fonts with proper hierarchy
- **Buttons**: Rounded corners with hover effects

### UI Components
- **Cards**: Glassmorphism design with backdrop blur
- **Buttons**: Gradient backgrounds with shimmer effects
- **Animations**: Smooth transitions using Framer Motion

## 📁 Project Structure

```
bolt-spot-me-sis/
├── public/
│   ├── images/           # App images and logos
│   └── index.html        # Main HTML file
├── src/
│   ├── components/       # React components
│   │   ├── CameraView.tsx
│   │   ├── CoachSelector.tsx
│   │   ├── FeedbackBubble.tsx
│   │   ├── LandingPage.tsx
│   │   ├── PhoneFrame.tsx
│   │   ├── ProgressGallery.tsx
│   │   ├── ProgressTracker.tsx
│   │   ├── ReminderSetup.tsx
│   │   └── WorkoutControls.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── usePoseDetection.ts
│   ├── data/             # Static data and configurations
│   │   └── feedback.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx           # Main app component
│   └── main.tsx          # App entry point
├── package.json          # Dependencies and scripts
├── tailwind.config.js    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite build configuration
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Spot Me Sis
VITE_APP_VERSION=1.0.0
```

### Tailwind Configuration
The app uses a custom Tailwind configuration with:
- Extended color palette
- Custom animations
- Responsive breakpoints

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Development Guidelines

### Code Style
- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Use functional components with hooks
- Implement proper error handling

### Component Structure
```typescript
interface ComponentProps {
  // Define props interface
}

export const Component: React.FC<ComponentProps> = ({ prop1, prop2 }) => {
  // Component logic
  return (
    // JSX
  );
};
```

### Styling
- Use Tailwind CSS classes
- Implement responsive design
- Follow the established design system
- Use Framer Motion for animations

## 🐛 Troubleshooting

### Common Issues

#### Camera Not Working
- **Ensure HTTPS is enabled** (required for camera access)
- Check browser permissions
- Try refreshing the page
- Make sure you're using a modern browser (Chrome, Firefox, Safari)

#### Pose Detection Issues
- **Ensure good lighting** - bright, even lighting works best
- **Position camera properly** - stand 6-8 feet from camera
- **Check for browser compatibility** - use Chrome for best results
- **Clear browser cache** if detection is slow

#### Performance Issues
- Close other browser tabs
- Ensure stable internet connection
- Check device specifications
- Use a device with a good camera

### Camera Setup Tips
- **Good Lighting**: Natural light or bright indoor lighting
- **Camera Position**: Mount camera at hip level for best angle
- **Background**: Plain, uncluttered background
- **Clothing**: Wear form-fitting clothes for better detection
- **Space**: Ensure you have room to perform squats

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **MediaPipe** for advanced pose detection technology
- **TensorFlow.js** for machine learning capabilities
- **Framer Motion** for smooth animations
- **Tailwind CSS** for beautiful styling

## 📞 Support

For support, email support@spotmesis.com or join our Discord community.

---

**Made with 💗 for girls who want to feel strong and supported** ✨
