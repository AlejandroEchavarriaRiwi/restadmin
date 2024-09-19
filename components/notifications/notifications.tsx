import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface NotificationProps {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  onClose: (id: string) => void;
}

const notificationColors = {
  info: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500',
};

export const DesktopNotification: React.FC<NotificationProps> = ({ id, message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      className={`fixed right-4 top-4 w-80 ${notificationColors[type]} text-white p-4 rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <p className="font-semibold">{message}</p>
        <button onClick={() => onClose(id)} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export const MobileNotification: React.FC<NotificationProps> = ({ id, message, type, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      className={`fixed bottom-4 left-4 right-4 ${notificationColors[type]} text-white p-4 rounded-lg shadow-lg`}
    >
      <div className="flex justify-between items-center">
        <p className="font-semibold">{message}</p>
        <button onClick={() => onClose(id)} className="text-white hover:text-gray-200">
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export const NotificationContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AnimatePresence>
      {children}
    </AnimatePresence>
  );
};