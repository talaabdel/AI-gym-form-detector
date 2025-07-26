import { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as posenet from '@tensorflow-models/posenet';
import { Pose, FormFeedback } from '../types';

export const usePoseDetection = () => {
  const [model, setModel] = useState<posenet.PoseNet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [currentPose, setCurrentPose] = useState<Pose | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        await tf.ready();
        const net = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: 640, height: 480 },
          multiplier: 0.75
        });
        setModel(net);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading PoseNet model:', error);
        setIsLoading(false);
      }
    };

    loadModel();
  }, []);

  const startCamera = async () => {
    try {
      // Stop any existing stream first
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      
      // Reset camera ready state
      setIsCameraReady(false);
      
      // Small delay to ensure previous stream is fully stopped
      await new Promise(resolve => setTimeout(resolve, 50));
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsCameraReady(true);
        };
        await videoRef.current.play();
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setIsCameraReady(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraReady(false);
    setCurrentPose(null);
  };

  const detectPose = async () => {
    if (!model || !videoRef.current || !canvasRef.current || !isCameraReady) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const pose = await model.estimateSinglePose(video, {
      flipHorizontal: true
    });

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Draw pose keypoints
    drawKeypoints(ctx, pose.keypoints);
    drawSkeleton(ctx, pose.keypoints);

    // Convert to our Pose type
    const formattedPose: Pose = {
      keypoints: pose.keypoints.map(kp => ({
        part: kp.part,
        position: kp.position,
        score: kp.score
      })),
      score: pose.score
    };

    setCurrentPose(formattedPose);
  };

  const drawKeypoints = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    keypoints.forEach(keypoint => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.position.x, keypoint.position.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF6B9D';
        ctx.fill();
      }
    });
  };

  const drawSkeleton = (ctx: CanvasRenderingContext2D, keypoints: any[]) => {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, 0.3);
    
    adjacentKeyPoints.forEach(keypoints => {
      ctx.beginPath();
      ctx.moveTo(keypoints[0].position.x, keypoints[0].position.y);
      ctx.lineTo(keypoints[1].position.x, keypoints[1].position.y);
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#FF6B9D';
      ctx.stroke();
    });
  };

  const analyzeSquatForm = (pose: Pose): FormFeedback | null => {
    if (!pose || pose.keypoints.length === 0) return null;

    const leftHip = pose.keypoints.find(kp => kp.part === 'leftHip');
    const rightHip = pose.keypoints.find(kp => kp.part === 'rightHip');
    const leftKnee = pose.keypoints.find(kp => kp.part === 'leftKnee');
    const rightKnee = pose.keypoints.find(kp => kp.part === 'rightKnee');
    const leftAnkle = pose.keypoints.find(kp => kp.part === 'leftAnkle');
    const rightAnkle = pose.keypoints.find(kp => kp.part === 'rightAnkle');

    if (!leftHip || !rightHip || !leftKnee || !rightKnee || !leftAnkle || !rightAnkle) {
      return null;
    }

    const avgHipY = (leftHip.position.y + rightHip.position.y) / 2;
    const avgKneeY = (leftKnee.position.y + rightKnee.position.y) / 2;
    const avgAnkleY = (leftAnkle.position.y + rightAnkle.position.y) / 2;

    // Check squat depth
    const squatDepth = avgKneeY - avgHipY;
    const isDeepEnough = squatDepth > 30; // Adjust threshold as needed

    // Check knee alignment
    const kneeAlignment = Math.abs(leftKnee.position.x - rightKnee.position.x);
    const hipAlignment = Math.abs(leftHip.position.x - rightHip.position.x);
    const kneeCollapse = kneeAlignment < hipAlignment * 0.8;

    if (!isDeepEnough) {
      return {
        type: 'warning',
        message: 'Go deeper! Sit that booty down like you mean it! 🍑',
        exercise: 'squat',
        timestamp: Date.now()
      };
    }

    if (kneeCollapse) {
      return {
        type: 'error',
        message: 'Keep those knees out, bestie! Protect those joints! 💪',
        exercise: 'squat',
        timestamp: Date.now()
      };
    }

    return {
      type: 'good',
      message: 'Perfect squat! You\'re absolutely crushing it! 🔥',
      exercise: 'squat',
      timestamp: Date.now()
    };
  };

  return {
    model,
    isLoading,
    isCameraReady,
    currentPose,
    videoRef,
    canvasRef,
    startCamera,
    stopCamera,
    detectPose,
    analyzeSquatForm
  };
};