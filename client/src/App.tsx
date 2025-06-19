import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Header, SearchForm, StatusMessage, AvailableCars, BookingHistory } from './components';
import { BookingForm, Booking, AvailableCar, BookingData } from './types';
import { searchAvailableCars, createBooking } from './services';

const App: React.FC = () => {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState<BookingForm>({
    email: '',
    start_date: today,
    end_date: today,
    expire_date: today
  });
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [availableCars, setAvailableCars] = useState<AvailableCar[]>([]);
  const [userId, setUserId] = useState<number>(-1);
  const [message, setMessage] = useState<string>("");
  const [state, setState] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value.toString() });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);
    
    try {
      const result = await searchAvailableCars(form);
      
      // Handle new API response structure
      if (result.success && result.data) {
        setAvailableCars(result.data.available || []);
        setBookings(result.data.bookingList?.bookings || []);
        setUserId(result.data.user_id);
        setState(true);
        if (result.data.available?.length === 0) {
          setMessage("No cars available for selected dates");
        }
      } else {
        setAvailableCars([]);
        setState(false);
        
        // Handle new error codes
        if (result.error === 'INVALID_DATE_RANGE') {
          setBookings([]);
          setMessage("Invalid date range");
        } else if (result.error === 'INVALID_LICENSE_DATE') {
          setBookings([]);
          setMessage("Invalid license date");
        } else if (result.error === 'BOOKING_CONFLICT') {
          setBookings(result.data?.bookingList?.bookings || []);
          setUserId(result.data?.user_id || -1);
          setMessage("Already Booked");
        } else {
          setMessage(result.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Something went wrong');
      setState(false);
      setAvailableCars([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async (index: number) => {
    setIsLoading(true);
    
    try {
      const selectedCar = availableCars[index];
      const bookingData: BookingData = {
        user_id: userId,
        car_id: selectedCar.car_id,
        start_date: form.start_date,
        end_date: form.end_date,
        total_price: parseFloat(selectedCar.total_price.toString()),
        average_price: parseFloat(selectedCar.average_price.toString())
      };

      const result = await createBooking(bookingData);
      
      if (result.success && result.data) {
        setMessage("Successfully booked!");
        setState(true);
        setBookings(result.data.bookings || []);
        setAvailableCars([]);
      } else {
        setMessage(result.message || "Failed to create booking");
        setState(false);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setMessage('Something went wrong');
      setState(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <SearchForm 
          form={form}
          isLoading={isLoading}
          onFormChange={handleChange}
          onSubmit={handleSubmit}
        />

        {message && (
          <StatusMessage message={message} isSuccess={state} />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <AvailableCars 
            availableCars={availableCars}
            isLoading={isLoading}
            onBook={handleBook}
          />
          
          <BookingHistory bookings={bookings} />
        </div>
      </main>
    </div>
  );
};

export default App;