import { useEffect, useRef, useState, useCallback } from 'react';
import { Pose, Results, NormalizedLandmark } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { FormFeedback } from '../types';

export const usePoseDetection = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [currentPose, setCurrentPose] = useState<Results | null>(null);
  const [formScore, setFormScore] = useState(0);
  const [isInSquatPosition, setIsInSquatPosition] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  // Initialize MediaPipe Pose
  useEffect(() => {
    const initializePose = async () => {
      try {
        const pose = new Pose({
          locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          enableSegmentation: false,
          smoothSegmentation: false,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onPoseResults);
        poseRef.current = pose;
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing MediaPipe Pose:', error);
        setIsLoading(false);
      }
    };

    initializePose();
  }, []);

  const onPoseResults = useCallback((results: Results) => {
    setCurrentPose(results);
    
    if (results.poseLandmarks) {
      const feedback = analyzeSquatForm(results.poseLandmarks);
      if (feedback) {
        // This will be handled by the parent component
        console.log('Form feedback:', feedback);
      }
    }

    // Draw video frame and pose on canvas
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw the video frame first
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        // Then draw the pose landmarks on top
        if (results.poseLandmarks) {
          drawConnectors(ctx, results.poseLandmarks, Pose.POSE_CONNECTIONS, {
            color: '#FF6B9D',
            lineWidth: 2
          });
          drawLandmarks(ctx, results.poseLandmarks, {
            color: '#FF6B9D',
            lineWidth: 1,
            radius: 3
          });
        }
      }
    }
  }, []);

  const startCamera = async () => {
    try {
      if (!poseRef.current || !videoRef.current) return;

      setIsCameraReady(false);
      
      // Try MediaPipe Camera first
      try {
        const camera = new Camera(videoRef.current, {
          onFrame: async () => {
            if (poseRef.current && videoRef.current) {
              await poseRef.current.send({ image: videoRef.current });
            }
          },
          width: 640,
          height: 480
        });

        await camera.start();
        cameraRef.current = camera;
        setIsCameraReady(true);
      } catch (mediaPipeError) {
        console.log('MediaPipe Camera failed, trying fallback...', mediaPipeError);
        
        // Fallback to standard getUserMedia
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: 640, 
            height: 480, 
            facingMode: 'user' 
          }
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
          await videoRef.current.play();
          
          // Set up pose detection loop for fallback
          const detectPoseLoop = async () => {
            if (poseRef.current && videoRef.current && isCameraReady) {
              try {
                await poseRef.current.send({ image: videoRef.current });
              } catch (error) {
                console.error('Pose detection error:', error);
              }
            }
            requestAnimationFrame(detectPoseLoop);
          };
          detectPoseLoop();
        }
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
      cameraRef.current = null;
    }
    
    // Also stop any fallback stream
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setIsCameraReady(false);
    setCurrentPose(null);
    setFormScore(0);
    setIsInSquatPosition(false);
  };

  const analyzeSquatForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    if (!landmarks || landmarks.length === 0) return null;

    // Get key landmarks for squat analysis
    const leftHip = landmarks[23]; // Left hip
    const rightHip = landmarks[24]; // Right hip
    const leftKnee = landmarks[25]; // Left knee
    const rightKnee = landmarks[26]; // Right knee
    const leftAnkle = landmarks[27]; // Left ankle
    const rightAnkle = landmarks[28]; // Right ankle
    const leftShoulder = landmarks[11]; // Left shoulder
    const rightShoulder = landmarks[12]; // Right shoulder

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return null;
    }

    // Calculate squat depth
    const avgHipY = (leftHip.y + rightHip.y) / 2;
    const avgKneeY = (leftKnee.y + rightKnee.y) / 2;
    const avgAnkleY = (leftAnkle.y + rightAnkle.y) / 2;
    
    // Calculate knee angle
    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    
    // Calculate hip angle
    const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    
    // Determine if in squat position
    const isSquatting = kneeAngle < 120 && hipAngle < 160;
    setIsInSquatPosition(isSquatting);

    // Calculate form score (0-100)
    let score = 100;
    let issues: string[] = [];

    // Check squat depth
    const squatDepth = avgKneeY - avgHipY;
    if (squatDepth < 0.1) {
      score -= 30;
      issues.push('depth');
    }

    // Check knee alignment (knees should not go past toes)
    const kneeToeAlignment = leftKnee.x - leftAnkle.x;
    if (kneeToeAlignment > 0.05) {
      score -= 20;
      issues.push('knee_alignment');
    }

    // Check knee angle for proper squat depth
    if (kneeAngle > 110) {
      score -= 25;
      issues.push('knee_angle');
    }

    // Check hip angle
    if (hipAngle > 150) {
      score -= 15;
      issues.push('hip_angle');
    }

    // Ensure score doesn't go below 0
    score = Math.max(0, score);
    setFormScore(score);

    // Generate feedback based on issues
    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect squat form! You\'re absolutely crushing it! 🔥',
        exercise: 'squat',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good form! Try going a bit deeper for maximum gains! 💪',
        exercise: 'squat',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s work on your form! ';
      if (issues.includes('depth')) {
        message += 'Go deeper! Sit that booty down! 🍑';
      } else if (issues.includes('knee_alignment')) {
        message += 'Keep those knees behind your toes! 🦵';
      } else if (issues.includes('knee_angle')) {
        message += 'Bend those knees more! 💪';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'squat',
        timestamp: Date.now(),
        score: score
      };
    }
  };

  const calculateAngle = (point1: NormalizedLandmark, point2: NormalizedLandmark, point3: NormalizedLandmark): number => {
    const angle = Math.atan2(point3.y - point2.y, point3.x - point2.x) -
                  Math.atan2(point1.y - point2.y, point1.x - point2.x);
    let degrees = angle * 180 / Math.PI;
    if (degrees < 0) degrees += 360;
    return degrees;
  };

  const detectPose = useCallback(async () => {
    if (!poseRef.current || !videoRef.current || !isCameraReady) return;
    
    try {
      await poseRef.current.send({ image: videoRef.current });
    } catch (error) {
      console.error('Error detecting pose:', error);
    }
  }, [isCameraReady]);

  return {
    isLoading,
    isCameraReady,
    currentPose,
    formScore,
    isInSquatPosition,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectPose,
    analyzeSquatForm
  };
};