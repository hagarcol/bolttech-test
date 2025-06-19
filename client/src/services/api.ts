import { 
  BookingForm, 
  ApiResponse, 
  SearchCarsResponse, 
  BookingData, 
  CreateBookingResponse 
} from '../types';

const API_BASE_URL = 'http://localhost:3000/api/v1';

// Search for available cars
export const searchAvailableCars = async (formData: BookingForm): Promise<ApiResponse<SearchCarsResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/available-cars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Search cars API error:', error);
    throw new Error('Failed to search cars');
  }
};

// Create a new booking
export const createBooking = async (bookingData: BookingData): Promise<ApiResponse<CreateBookingResponse>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData)
    });
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Create booking API error:', error);
    throw new Error('Failed to create booking');
  }
}; 