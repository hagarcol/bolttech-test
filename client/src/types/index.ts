export interface BookingForm {
  email: string;
  start_date: string;
  end_date: string;
  expire_date: string;
}

export interface Model {
  model_id: number;
  model_name: string;
  price_peak: number;
  price_mid: number;
  price_off: number;
}

export interface Car {
  car_id: number;
  brand: string;
  model_id: number;
  model: Model;
}

export interface Booking {
  book_id: number;
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  average_price: number;
  car: Car;
}

export interface AvailableCar {
  car_id: number;
  brand: string;
  model_name: string;
  count: number;
  total_price: string;
  average_price: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SearchCarsResponse {
  available: AvailableCar[];
  bookingList?: {
    bookings: Booking[];
  };
  user_id: number;
}

export interface BookingData {
  user_id: number;
  car_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  average_price: number;
}

export interface CreateBookingResponse {
  bookings: Booking[];
} 