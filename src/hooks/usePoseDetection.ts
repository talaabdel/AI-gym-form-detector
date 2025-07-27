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
  const [isInExercisePosition, setIsInExercisePosition] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('squat');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

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
      const feedback = analyzeForm(results.poseLandmarks, currentExercise);
      if (feedback) {
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
  }, [currentExercise]);

  const startCamera = async () => {
    try {
      if (!poseRef.current || !videoRef.current) {
        console.error('Pose or video ref not available');
        return;
      }

      setIsCameraReady(false);
      
      // Check if camera permissions are available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('Camera API not supported in this browser');
        throw new Error('Camera API not supported');
      }

      // Check if we're on HTTPS (required for camera access in production)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
        console.warn('Camera access requires HTTPS in production');
      }

      // Try to get camera permissions first
      try {
        console.log('Requesting camera permissions...');
        const testStream = await navigator.mediaDevices.getUserMedia({
          video: { 
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user'
          },
          audio: false
        });
        
        // Stop the test stream immediately
        testStream.getTracks().forEach(track => track.stop());
        console.log('Camera permissions granted');
      } catch (permissionError) {
        console.error('Camera permission test failed:', permissionError);
        if (permissionError instanceof DOMException) {
          if (permissionError.name === 'NotAllowedError') {
            throw new Error('Camera permission denied. Please allow camera access and try again.');
          } else if (permissionError.name === 'NotFoundError') {
            throw new Error('No camera found on this device.');
          } else if (permissionError.name === 'NotReadableError') {
            throw new Error('Camera is already in use by another application.');
          } else if (permissionError.name === 'NotSupportedError') {
            throw new Error('Camera not supported in this browser or environment.');
          }
        }
        throw permissionError;
      }

      // Try MediaPipe Camera first
      try {
        console.log('Attempting to start MediaPipe Camera...');
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
        console.log('MediaPipe Camera started successfully');
      } catch (mediaPipeError) {
        console.log('MediaPipe Camera failed, trying fallback...', mediaPipeError);
        
        // Fallback to standard getUserMedia
        try {
          console.log('Attempting fallback camera access...');
          
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { 
              width: { ideal: 640 },
              height: { ideal: 480 },
              facingMode: 'user'
            },
            audio: false
          });
          
          streamRef.current = stream;
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              setIsCameraReady(true);
              console.log('Fallback camera started successfully');
            };
            await videoRef.current.play();
            
            // Set up pose detection loop for fallback
            const detectPoseLoop = async () => {
              if (poseRef.current && videoRef.current && isCameraReady && videoRef.current.readyState >= 2) {
                try {
                  await poseRef.current.send({ image: videoRef.current });
                } catch (error) {
                  console.error('Pose detection error:', error);
                }
              }
              if (isCameraReady) {
                requestAnimationFrame(detectPoseLoop);
              }
            };
            detectPoseLoop();
          }
        } catch (fallbackError) {
          console.error('Fallback camera failed:', fallbackError);
          
          // Check if it's a permission error
          if (fallbackError instanceof DOMException) {
            if (fallbackError.name === 'NotAllowedError') {
              console.error('Camera permission denied by user');
              throw new Error('Camera permission denied. Please allow camera access and try again.');
            } else if (fallbackError.name === 'NotFoundError') {
              console.error('No camera found');
              throw new Error('No camera found on this device.');
            } else if (fallbackError.name === 'NotReadableError') {
              console.error('Camera is already in use');
              throw new Error('Camera is already in use by another application.');
            } else if (fallbackError.name === 'NotSupportedError') {
              throw new Error('Camera not supported in this browser or environment.');
            }
          }
          
          setIsCameraReady(false);
          throw fallbackError;
        }
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setIsCameraReady(false);
      throw error;
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    
    if (cameraRef.current) {
      try {
        cameraRef.current.stop();
      } catch (error) {
        console.error('Error stopping MediaPipe camera:', error);
      }
      cameraRef.current = null;
    }
    
    // Stop any fallback stream
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach(track => {
          track.stop();
        });
      } catch (error) {
        console.error('Error stopping stream tracks:', error);
      }
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraReady(false);
    setCurrentPose(null);
    setFormScore(0);
    setIsInExercisePosition(false);
  };

  const analyzeForm = (landmarks: NormalizedLandmark[], exercise: string): FormFeedback | null => {
    if (!landmarks || landmarks.length === 0) return null;

    switch (exercise) {
      case 'squat':
        return analyzeSquatForm(landmarks);
      case 'pushup':
        return analyzePushupForm(landmarks);
      case 'plank':
        return analyzePlankForm(landmarks);
      case 'glutebridge':
        return analyzeGluteBridgeForm(landmarks);
      case 'deadlift':
        return analyzeDeadliftForm(landmarks);
      case 'lunges':
        return analyzeLungeForm(landmarks);
      default:
        return analyzeSquatForm(landmarks); // Default fallback
    }
  };

  const analyzeSquatForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return null;
    }

    const kneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const isSquatting = kneeAngle < 120 && hipAngle < 160;
    setIsInExercisePosition(isSquatting);

    let score = 100;
    let issues: string[] = [];

    const squatDepth = (leftKnee.y + rightKnee.y) / 2 - (leftHip.y + rightHip.y) / 2;
    if (squatDepth < 0.1) {
      score -= 30;
      issues.push('depth');
    }

    const kneeToeAlignment = leftKnee.x - leftAnkle.x;
    if (kneeToeAlignment > 0.05) {
      score -= 20;
      issues.push('knee_alignment');
    }

    if (kneeAngle > 110) {
      score -= 25;
      issues.push('knee_angle');
    }

    if (hipAngle > 150) {
      score -= 15;
      issues.push('hip_angle');
    }

    score = Math.max(0, score);
    setFormScore(score);

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

  const analyzePushupForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];

    if (!leftShoulder || !rightShoulder || !leftElbow || !rightElbow || !leftWrist || !rightWrist) {
      return null;
    }

    const elbowAngle = calculateAngle(leftShoulder, leftElbow, leftWrist);
    const isInPushupPosition = elbowAngle < 90 && leftShoulder.y > leftElbow.y;
    setIsInExercisePosition(isInPushupPosition);

    let score = 100;
    let issues: string[] = [];

    // Check if body is straight
    const shoulderHipAngle = Math.abs(leftShoulder.y - leftHip.y);
    if (shoulderHipAngle > 0.1) {
      score -= 25;
      issues.push('body_alignment');
    }

    // Check elbow angle
    if (elbowAngle > 100) {
      score -= 20;
      issues.push('elbow_angle');
    }

    // Check if going low enough
    const pushupDepth = leftShoulder.y - leftElbow.y;
    if (pushupDepth < 0.05) {
      score -= 30;
      issues.push('depth');
    }

    score = Math.max(0, score);
    setFormScore(score);

    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect push-up form! You\'re getting stronger! 💪',
        exercise: 'pushup',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good push-up! Keep that body straight! 🔥',
        exercise: 'pushup',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s improve that push-up! ';
      if (issues.includes('body_alignment')) {
        message += 'Keep your body in a straight line! 📏';
      } else if (issues.includes('elbow_angle')) {
        message += 'Bend those elbows more! 💪';
      } else if (issues.includes('depth')) {
        message += 'Go lower! Touch that chest to the ground! 🎯';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'pushup',
        timestamp: Date.now(),
        score: score
      };
    }
  };

  const analyzePlankForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip) {
      return null;
    }

    const bodyAngle = Math.abs(leftShoulder.y - leftHip.y);
    const isInPlankPosition = bodyAngle < 0.05 && leftShoulder.y < leftHip.y;
    setIsInExercisePosition(isInPlankPosition);

    let score = 100;
    let issues: string[] = [];

    // Check body alignment
    if (bodyAngle > 0.05) {
      score -= 40;
      issues.push('body_alignment');
    }

    // Check if hips are too high or low
    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    const heightDiff = Math.abs(hipHeight - shoulderHeight);
    if (heightDiff > 0.1) {
      score -= 30;
      issues.push('hip_position');
    }

    score = Math.max(0, score);
    setFormScore(score);

    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect plank! Your core is on fire! 🔥',
        exercise: 'plank',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good plank! Keep that body straight! 📏',
        exercise: 'plank',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s fix that plank! ';
      if (issues.includes('body_alignment')) {
        message += 'Keep your body in a straight line! 📏';
      } else if (issues.includes('hip_position')) {
        message += 'Don\'t let your hips sag! Keep them up! 🍑';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'plank',
        timestamp: Date.now(),
        score: score
      };
    }
  };

  const analyzeGluteBridgeForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee) {
      return null;
    }

    const hipHeight = (leftHip.y + rightHip.y) / 2;
    const kneeHeight = (leftKnee.y + rightKnee.y) / 2;
    const shoulderHeight = (leftShoulder.y + rightShoulder.y) / 2;
    
    const isBridging = hipHeight < kneeHeight && hipHeight < shoulderHeight;
    setIsInExercisePosition(isBridging);

    let score = 100;
    let issues: string[] = [];

    // Check bridge height
    const bridgeHeight = shoulderHeight - hipHeight;
    if (bridgeHeight < 0.1) {
      score -= 40;
      issues.push('height');
    }

    // Check knee angle
    const kneeAngle = calculateAngle(leftHip, leftKnee, landmarks[27]); // ankle
    if (kneeAngle < 80 || kneeAngle > 120) {
      score -= 30;
      issues.push('knee_angle');
    }

    score = Math.max(0, score);
    setFormScore(score);

    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect glute bridge! Booty gains incoming! 🍑',
        exercise: 'glutebridge',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good bridge! Push those hips higher! 💪',
        exercise: 'glutebridge',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s improve that bridge! ';
      if (issues.includes('height')) {
        message += 'Push those hips higher! Lift that booty! 🍑';
      } else if (issues.includes('knee_angle')) {
        message += 'Keep your knees at a good angle! 🦵';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'glutebridge',
        timestamp: Date.now(),
        score: score
      };
    }
  };

  const analyzeDeadliftForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];

    if (!leftShoulder || !rightShoulder || !leftHip || !rightHip || !leftKnee || !rightKnee) {
      return null;
    }

    const hipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const isDeadlifting = hipAngle < 150 && leftHip.y > leftKnee.y;
    setIsInExercisePosition(isDeadlifting);

    let score = 100;
    let issues: string[] = [];

    // Check back straightness
    const backAngle = Math.abs(leftShoulder.y - leftHip.y);
    if (backAngle > 0.05) {
      score -= 40;
      issues.push('back_straightness');
    }

    // Check hip hinge
    if (hipAngle > 160) {
      score -= 30;
      issues.push('hip_hinge');
    }

    score = Math.max(0, score);
    setFormScore(score);

    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect deadlift form! You\'re getting strong! 💪',
        exercise: 'deadlift',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good deadlift! Keep that back straight! 📏',
        exercise: 'deadlift',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s fix that deadlift! ';
      if (issues.includes('back_straightness')) {
        message += 'Keep your back straight! Don\'t round it! 📏';
      } else if (issues.includes('hip_hinge')) {
        message += 'Hinge at the hips, not the back! 🍑';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'deadlift',
        timestamp: Date.now(),
        score: score
      };
    }
  };

  const analyzeLungeForm = (landmarks: NormalizedLandmark[]): FormFeedback | null => {
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return null;
    }

    const frontKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const backKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);
    const isLunging = frontKneeAngle < 110 && backKneeAngle < 110;
    setIsInExercisePosition(isLunging);

    let score = 100;
    let issues: string[] = [];

    // Check front knee alignment
    const kneeToeAlignment = Math.abs(leftKnee.x - leftAnkle.x);
    if (kneeToeAlignment > 0.05) {
      score -= 30;
      issues.push('knee_alignment');
    }

    // Check depth
    const lungeDepth = Math.abs(leftKnee.y - rightKnee.y);
    if (lungeDepth < 0.1) {
      score -= 25;
      issues.push('depth');
    }

    // Check back knee
    if (rightKnee.y > 0.1) {
      score -= 20;
      issues.push('back_knee');
    }

    score = Math.max(0, score);
    setFormScore(score);

    if (score >= 90) {
      return {
        type: 'good',
        message: 'Perfect lunge! Your balance is incredible! ⚖️',
        exercise: 'lunges',
        timestamp: Date.now(),
        score: score
      };
    } else if (score >= 70) {
      return {
        type: 'warning',
        message: 'Good lunge! Go a bit deeper! 💪',
        exercise: 'lunges',
        timestamp: Date.now(),
        score: score
      };
    } else {
      let message = 'Let\'s improve that lunge! ';
      if (issues.includes('knee_alignment')) {
        message += 'Keep your front knee behind your toe! 🦵';
      } else if (issues.includes('depth')) {
        message += 'Go deeper! Lower that back knee! 📉';
      } else if (issues.includes('back_knee')) {
        message += 'Don\'t let your back knee touch the ground! 🚫';
      } else {
        message += 'Focus on your form! You got this! ✨';
      }

      return {
        type: 'error',
        message: message,
        exercise: 'lunges',
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

  const setExercise = (exercise: string) => {
    setCurrentExercise(exercise);
  };

  return {
    isLoading,
    isCameraReady,
    currentPose,
    formScore,
    isInExercisePosition,
    currentExercise,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectPose,
    analyzeForm,
    setExercise
  };
};