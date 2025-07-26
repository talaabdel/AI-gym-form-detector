import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, BellIcon, ClockIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { Reminder } from '../types';

interface ReminderSetupProps {
  isOpen: boolean;
  onClose: () => void;
}

const demoMessages = [
  "SMS 💪 Today's glute day! Get that booty popping! 🍑",
  "SMS 🔥 Time to crush those squats! You got this queen! 👑",
  "SMS ✨ Arm day alert! Let's get those guns firing! 💪",
  "SMS 🏃‍♀️ Cardio time! Let's get that heart pumping! ❤️",
  "SMS 🧘‍♀️ Yoga flow time! Find your inner peace and strength! 🕉️",
  "SMS 💃 Dance workout! Shake it off and feel amazing! ✨",
  "SMS 🏋️‍♀️ Leg day! Strong legs, strong mind! 💪",
  "SMS 🎯 Core time! Let's build that powerhouse! 🔥",
  "SMS 🌟 It's workout o'clock! Time to slay those goals! ⚡",
  "SMS 🍑 Booty gains don't happen by accident! Let's work! 💪",
  "SMS 🔥 Your future self is watching! Make her proud! 👑",
  "SMS ✨ Strong is the new sexy! Let's get it! 💃",
  "SMS 🏋️‍♀️ Deadlift day! Channel your inner beast! 🦁",
  "SMS 🎯 Abs are made in the kitchen, but revealed in the gym! 🔥",
  "SMS 💪 Push day! Let's get those gains! 💪",
  "SMS 🏃‍♀️ Running time! Chase those dreams! ⚡",
  "SMS 🧘‍♀️ Mind and body connection! Find your flow! 🕉️",
  "SMS 💃 HIIT time! Burn it all! 🔥",
  "SMS 🎯 Shoulder day! Build those boulders! 💪",
  "SMS 🌟 You're one workout away from a good mood! ✨"
];

export const ReminderSetup: React.FC<ReminderSetupProps> = ({
  isOpen,
  onClose
}) => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedMessage, setSelectedMessage] = useState(demoMessages[0]);
  const [showSMSDemo, setShowSMSDemo] = useState(false);

  const addReminder = () => {
    const newReminder: Reminder = {
      id: Date.now().toString(),
      time: selectedTime,
      message: selectedMessage,
      isActive: true
    };
    setReminders([...reminders, newReminder]);
  };

  const toggleReminder = (id: string) => {
    setReminders(reminders.map(r => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const deleteReminder = (id: string) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const showSMSNotification = () => {
    setShowSMSDemo(true);
    setTimeout(() => setShowSMSDemo(false), 5000);
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
                <BellIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Daily Reminders ⏰</h2>
                <p className="text-gray-600">Never miss a workout with these hype messages!</p>
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
            {/* Add New Reminder */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-xl mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ClockIcon className="w-5 h-5" />
                Set New Reminder
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <select
                    value={selectedMessage}
                    onChange={(e) => setSelectedMessage(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    {demoMessages.map((message, index) => (
                      <option key={index} value={message}>
                        {message}
                      </option>
                    ))}
                  </select>
                </div>

                <motion.button
                  onClick={addReminder}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-pink-200 text-pink-800 border border-pink-300 py-3 rounded-lg font-medium hover:bg-pink-300 transition-all"
                >
                  Add Reminder ✨
                </motion.button>
              </div>
            </div>

            {/* Active Reminders */}
            {reminders.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <ChatBubbleLeftRightIcon className="w-5 h-5" />
                  Your Reminders
                </h3>
                
                <div className="space-y-3">
                  {reminders.map((reminder) => (
                    <motion.div
                      key={reminder.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${reminder.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                          <div>
                            <div className="font-medium text-gray-800">{reminder.time}</div>
                            <div className="text-sm text-gray-600">{reminder.message}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => toggleReminder(reminder.id)}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              reminder.isActive 
                                ? 'bg-green-100 text-green-700' 
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {reminder.isActive ? 'Active' : 'Inactive'}
                          </button>
                          <button
                            onClick={() => deleteReminder(reminder.id)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <XMarkIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Demo SMS Button */}
                <motion.button
                  onClick={showSMSNotification}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 bg-pink-200 text-pink-800 border border-pink-300 py-3 rounded-lg font-medium hover:bg-pink-300 transition-all"
                >
                  Test SMS Demo 📱
                </motion.button>
              </div>
            )}

            {/* Empty State */}
            {reminders.length === 0 && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BellIcon className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No reminders set yet!</h3>
                <p className="text-gray-500">Add your first reminder above to get started! ⏰</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* SMS Demo Notification */}
        <AnimatePresence>
          {showSMSDemo && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl border border-gray-200 p-4 max-w-sm z-[60]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">SMS</span>
                </div>
                <div>
                  <div className="font-medium text-gray-800">Spot Me Sis</div>
                  <div className="text-xs text-gray-500">Just now</div>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-3 rounded-lg">
                <p className="text-gray-700 text-sm font-medium">
                  {selectedMessage}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
}; 