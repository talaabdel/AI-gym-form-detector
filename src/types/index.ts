export interface CoachPersonality {
  id: string;
  name: string;
  emoji: string;
  description: string;
  color: string;
  avatar: string;
}

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