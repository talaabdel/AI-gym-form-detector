export interface CoachPersonality {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  avatar: string;
}

// MediaPipe Pose types
export interface NormalizedLandmark {
  x: number;
  y: number;
  z: number;
  visibility?: number;
}

export interface Results {
  poseLandmarks?: NormalizedLandmark[];
  poseWorldLandmarks?: NormalizedLandmark[];
  segmentationMask?: ImageData;
}

// Legacy Pose type for backward compatibility
export interface Pose {
  keypoints: Array<{
    part: string;
    position: { x: number; y: number };
    score: number;
  }>;
  score: number;
}

export interface FormFeedback {
  type: 'good' | 'warning' | 'error';
  message: string;
  exercise: string;
  timestamp: number;
  score?: number; // Form accuracy score (0-100)
}

export interface ProgressPhoto {
  id: string;
  imageData: string;
  exercise: string;
  timestamp: number;
  feedback: string;
}

export interface WorkoutSession {
  id: string;
  startTime: number;
  endTime?: number;
  exercise: string;
  coach: string;
  goodReps: number;
  totalReps: number;
  photos: ProgressPhoto[];
}

export interface Reminder {
  id: string;
  time: string;
  message: string;
  isActive: boolean;
}

export interface ProgressView {
  isOpen: boolean;
  selectedPhoto: ProgressPhoto | null;
}