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
    <div className="h-full bg-white">
      {/* Content */}
      <div className="p-5 h-full pt-8">
        <div className="mb-6">
          <h3 className="text-base font-medium text-gray-600">Never miss a workout with these hype messages!</h3>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {/* Add New Reminder */}
          <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-xl">
                             <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                 <ClockIcon className="w-4 h-4" />
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
                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                   />
                 </div>

                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">
                     Message
                   </label>
                   <select
                     value={selectedMessage}
                     onChange={(e) => setSelectedMessage(e.target.value)}
                     className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
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
                   className="w-full bg-pink-200 text-pink-800 border border-pink-300 py-2.5 rounded-lg font-medium hover:bg-pink-300 transition-all text-sm"
                 >
                   Add Reminder ✨
                 </motion.button>
               </div>
            </div>

                         {/* Active Reminders */}
             {reminders.length > 0 && (
               <div>
                 <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                   <ChatBubbleLeftRightIcon className="w-4 h-4" />
                   Your Reminders
                 </h3>
                 
                 <div className="space-y-3">
                   {reminders.map((reminder) => (
                     <motion.div
                       key={reminder.id}
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
                     >
                       <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <div className={`w-2.5 h-2.5 rounded-full ${reminder.isActive ? 'bg-green-500' : 'bg-gray-300'}`} />
                           <div>
                             <div className="font-medium text-gray-800 text-sm">{reminder.time}</div>
                             <div className="text-xs text-gray-600">{reminder.message}</div>
                           </div>
                         </div>
                         <div className="flex items-center gap-1">
                           <button
                             onClick={() => toggleReminder(reminder.id)}
                             className={`px-2 py-1 rounded-full text-xs font-medium ${
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
                             <XMarkIcon className="w-3.5 h-3.5" />
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
                   className="w-full mt-4 bg-pink-200 text-pink-800 border border-pink-300 py-2.5 rounded-lg font-medium hover:bg-pink-300 transition-all text-sm"
                 >
                   Test SMS Demo 📱
                 </motion.button>
               </div>
             )}

                         {/* Empty State */}
             {reminders.length === 0 && (
               <div className="text-center py-12">
                 <div className="w-20 h-20 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <BellIcon className="w-10 h-10 text-gray-400" />
                 </div>
                 <h3 className="text-lg font-semibold text-gray-700 mb-2">No reminders set yet!</h3>
                 <p className="text-gray-500 text-sm">Add your first reminder above to get started! ⏰</p>
               </div>
             )}
        </div>

                 {/* SMS Demo Notification */}
         <AnimatePresence>
           {showSMSDemo && (
             <motion.div
               initial={{ opacity: 0, y: -50, scale: 0.9 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -50, scale: 0.9 }}
               className="absolute top-2 left-2 right-2 bg-gray-900 rounded-2xl shadow-2xl p-3 z-[60]"
             >
               {/* iPhone Status Bar */}
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-1">
                   <div className="text-white text-xs font-semibold">9:41</div>
                 </div>
                 <div className="flex items-center gap-1">
                   <div className="w-4 h-2 bg-white rounded-sm"></div>
                   <div className="text-white text-xs">100%</div>
                 </div>
               </div>
               
               {/* iMessage Header */}
               <div className="flex items-center gap-2 mb-3">
                 <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center">
                   <span className="text-white text-sm font-bold">S</span>
                 </div>
                 <div>
                   <div className="font-semibold text-white text-sm">Spot Me Sis</div>
                   <div className="text-gray-400 text-xs">Just now</div>
                 </div>
               </div>
               
               {/* iMessage Bubble */}
               <div className="flex justify-start">
                 <div className="bg-gray-700 rounded-2xl rounded-tl-md px-3 py-2 max-w-[80%]">
                   <p className="text-white text-sm leading-relaxed">
                     {selectedMessage}
                   </p>
                 </div>
               </div>
             </motion.div>
           )}
         </AnimatePresence>
      </div>
    </div>
  );
}; 