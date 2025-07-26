import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, CameraIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { ProgressPhoto } from '../types';

interface ProgressGalleryProps {
  photos: ProgressPhoto[];
  isOpen: boolean;
  onClose: () => void;
  selectedPhoto: ProgressPhoto | null;
  onSelectPhoto: (photo: ProgressPhoto | null) => void;
}

export const ProgressGallery: React.FC<ProgressGalleryProps> = ({
  photos,
  isOpen,
  onClose,
  selectedPhoto,
  onSelectPhoto
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
                 className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
                     className="bg-white rounded-2xl w-full h-full max-h-[95vh] overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg">
                <CameraIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Progress Gallery 📊</h2>
                <p className="text-gray-600">Track your fitness journey with these amazing shots!</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {photos.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CameraIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No photos yet!</h3>
                <p className="text-gray-500">Start your workout to capture some amazing progress shots! 💪</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {photos.map((photo) => (
                  <motion.div
                    key={photo.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="relative group cursor-pointer"
                    onClick={() => onSelectPhoto(photo)}
                  >
                    <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 shadow-lg">
                      <img
                        src={photo.imageData}
                        alt={`${photo.exercise} form`}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                      <div className="flex items-center gap-1 mb-1">
                        <CalendarIcon className="w-3 h-3" />
                        <span>{formatDate(photo.timestamp)}</span>
                      </div>
                      <div className="font-medium">{photo.exercise}</div>
                    </div>
                    <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                      Perfect! ✨
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Photo Modal */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4"
              onClick={() => onSelectPhoto(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">
                      {selectedPhoto.exercise} - {formatDate(selectedPhoto.timestamp)}
                    </h3>
                    <button
                      onClick={() => onSelectPhoto(null)}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <XMarkIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </div>
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={selectedPhoto.imageData}
                      alt={`${selectedPhoto.exercise} form`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-xl">
                    <p className="text-gray-700 font-medium">{selectedPhoto.feedback}</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}; 