import React from 'react';
import { FaCar } from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="relative backdrop-blur-md bg-white border-b border-gray-100 shadow-sm">
      <div className="absolute inset-0 bg-orange-50/50"></div>
      <div className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
              <FaCar className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-orange-600">
                Bolttech Carental
              </h1>
              <p className="text-gray-500 font-medium">Premium Car Rental Experience</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 