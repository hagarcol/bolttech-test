import React from 'react';
import { FaCar, FaBolt, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { AvailableCar } from '../types';

interface AvailableCarsProps {
  availableCars: AvailableCar[];
  isLoading: boolean;
  onBook: (index: number) => void;
}

const AvailableCars: React.FC<AvailableCarsProps> = ({ availableCars, isLoading, onBook }) => {
  return (
    <div className="backdrop-blur-lg bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-orange-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCar className="text-2xl" />
            <div>
              <h3 className="text-xl font-bold">Available Cars</h3>
              <p className="text-orange-100">
                {availableCars.length} vehicle{availableCars.length !== 1 ? 's' : ''} ready for booking
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{availableCars.length}</div>
            <div className="text-xs text-orange-100">Available</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {availableCars.length > 0 ? (
          <div className="space-y-4">
            {availableCars.map((car, index) => (
              <div key={index} className="group bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaCar className="text-white text-2xl" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {car.brand}
                      </h4>
                      <p className="text-gray-600 font-medium">{car.model_name}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {car.count} available
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-800">${car.total_price}</div>
                    <div className="text-sm text-gray-500">Total Price</div>
                    <div className="text-xs text-gray-400 mt-1">${car.average_price}/day</div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onBook(index)}
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin h-4 w-4" />
                        <span>Booking...</span>
                      </>
                    ) : (
                      <>
                        <FaBolt />
                        <span>Book Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4 text-gray-400 flex justify-center">
              <FaCheckCircle />
            </div>
            <h4 className="text-xl font-semibold mb-2">No Cars Available</h4>
            <p className="text-gray-400">Try different dates or check back later</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableCars; 