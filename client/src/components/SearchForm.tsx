import React, { ChangeEvent, FormEvent } from 'react';
import { FaSearch, FaEnvelope, FaCalendarAlt, FaIdCard, FaSpinner } from 'react-icons/fa';
import { BookingForm } from '../types';

interface SearchFormProps {
  form: BookingForm;
  isLoading: boolean;
  onFormChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const SearchForm: React.FC<SearchFormProps> = ({ form, isLoading, onFormChange, onSubmit }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="mb-8">
      <div className="backdrop-blur-lg bg-white rounded-3xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-all duration-300">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
            <FaSearch className="text-white text-sm" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect Car</h2>
        </div>
        
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-gray-600 mb-3">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white backdrop-blur-sm"
                type="email"
                name="email"
                placeholder="your.email@example.com"
                value={form.email}
                onChange={onFormChange}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">Start Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white backdrop-blur-sm"
                type="date"
                name="start_date"
                value={form.start_date}
                onChange={onFormChange}
                min={today}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">End Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white backdrop-blur-sm"
                type="date"
                name="end_date"
                value={form.end_date}
                onChange={onFormChange}
                min={form.start_date}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-3">License Expiry</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all duration-200 bg-white backdrop-blur-sm"
                type="date"
                name="expire_date"
                value={form.expire_date}
                onChange={onFormChange}
                min={today}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="flex items-end">
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin h-5 w-5" />
                  <span>Searching...</span>
                </>
              ) : (
                <>
                  <FaSearch />
                  <span>Search Cars</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm; 