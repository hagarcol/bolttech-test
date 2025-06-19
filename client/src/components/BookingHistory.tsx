import React from 'react';
import { FaClipboardList, FaTicketAlt, FaCalendarAlt, FaFileAlt } from 'react-icons/fa';
import { Booking } from '../types';

interface BookingHistoryProps {
  bookings: Booking[];
}

const BookingHistory: React.FC<BookingHistoryProps> = ({ bookings }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="backdrop-blur-lg bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="bg-green-600 p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaClipboardList className="text-2xl" />
            <div>
              <h3 className="text-xl font-bold">Your Bookings</h3>
              <p className="text-green-100">
                {bookings.length} active booking{bookings.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{bookings.length}</div>
            <div className="text-xs text-green-100">Total</div>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {bookings.length > 0 ? (
          <div className="space-y-4">
            {bookings.map((booking, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-200 hover:border-green-300 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center shadow-lg">
                      <FaTicketAlt className="text-white text-lg" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-800">
                        {booking.car.brand} {booking.car.model.model_name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>{formatDate(booking.start_date)}</span>
                        </div>
                        <span>→</span>
                        <div className="flex items-center space-x-1">
                          <FaCalendarAlt className="text-gray-500" />
                          <span>{formatDate(booking.end_date)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-800">${booking.total_price}</div>
                    <div className="text-xs text-gray-500">${booking.average_price}/day avg</div>
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <div className="text-6xl mb-4 text-gray-400 flex justify-center">
              <FaFileAlt />
            </div>
            <h4 className="text-xl font-semibold mb-2">No Bookings Yet</h4>
            <p className="text-gray-400">Your reservations will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingHistory; 