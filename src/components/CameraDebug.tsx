import React, { useState } from 'react';

export const CameraDebug: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [testResult, setTestResult] = useState<string>('');

  const runDebugTest = async () => {
    const info: any = {
      protocol: window.location.protocol,
      hostname: window.location.hostname,
      userAgent: navigator.userAgent,
      mediaDevices: !!navigator.mediaDevices,
      getUserMedia: !!navigator.mediaDevices?.getUserMedia,
      permissions: !!navigator.permissions,
      timestamp: new Date().toISOString()
    };

    // Test camera permissions
    if (navigator.permissions) {
      try {
        const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
        info.cameraPermission = permission.state;
      } catch (error) {
        info.cameraPermission = 'Error: ' + error;
      }
    }

    // Test getUserMedia
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        info.getUserMediaTest = 'SUCCESS';
        stream.getTracks().forEach(track => track.stop());
      } catch (error: any) {
        info.getUserMediaTest = 'FAILED: ' + error.name + ' - ' + error.message;
      }
    }

    setDebugInfo(info);
    setTestResult('Debug test completed. Check console for details.');
    console.log('Camera Debug Info:', info);
  };

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <h3 className="font-bold mb-2">🔧 Camera Debug</h3>
      <button 
        onClick={runDebugTest}
        className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs mb-2"
      >
        Run Debug Test
      </button>
      
      {testResult && (
        <div className="mb-2 text-green-400">{testResult}</div>
      )}
      
      {Object.keys(debugInfo).length > 0 && (
        <div className="space-y-1">
          {Object.entries(debugInfo).map(([key, value]) => (
            <div key={key} className="flex justify-between">
              <span className="text-gray-300">{key}:</span>
              <span className="text-white">{String(value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 