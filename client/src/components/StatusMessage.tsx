import React from 'react';
import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface StatusMessageProps {
  message: string;
  isSuccess: boolean;
}

const StatusMessage: React.FC<StatusMessageProps> = ({ message, isSuccess }) => {
  return (
    <div className={`mb-8 p-6 rounded-2xl border backdrop-blur-sm transition-all duration-300 ${
      isSuccess 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-orange-50 border-orange-200 text-orange-800'
    }`}>
      <div className="flex items-center space-x-3">
        <div className={`text-2xl ${isSuccess ? 'text-green-600' : 'text-orange-600'}`}>
          {isSuccess ? <FaCheck /> : <FaExclamationTriangle />}
        </div>
        <div>
          <p className="font-semibold">{isSuccess ? 'Success!' : 'Attention Required'}</p>
          <p className="text-sm opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default StatusMessage; 