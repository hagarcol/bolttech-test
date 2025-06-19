import { Request, Response } from 'express';
import { BookingService } from '../services/booking.service';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../types';
import { CreateBookingDto } from '../dtos/booking.dto';

export class BookingController {
  private bookingService: BookingService;
  private userService: UserService;

  constructor() {
    this.bookingService = new BookingService();
    this.userService = new UserService();
  }

  public async createBooking(req: Request, res: Response): Promise<void> {
    const { user_id, car_id, start_date, end_date, total_price, average_price } = req.body as CreateBookingDto;

    await this.bookingService.createBooking({
      userId: user_id,
      carId: car_id,
      startDate: start_date,
      endDate: end_date,
      totalPrice: total_price,
      averagePrice: average_price
    });

    const updatedUser = await this.userService.getUserById(user_id);

    const response: ApiResponse = {
      success: true,
      message: 'Booking created successfully',
      data: updatedUser
    };

    res.status(201).json(response);
  }

  public async getUserBookings(req: Request, res: Response): Promise<void> {
    const userId = parseInt(req.params.userId);
    const bookings = await this.bookingService.getUserBookings(userId);

    const response: ApiResponse = {
      success: true,
      data: bookings
    };

    res.json(response);
  }

  public async cancelBooking(req: Request, res: Response): Promise<void> {
    const bookingId = parseInt(req.params.bookingId);
    const userId = parseInt(req.body.userId);

    await this.bookingService.cancelBooking(bookingId, userId);

    const response: ApiResponse = {
      success: true,
      message: 'Booking cancelled successfully'
    };

    res.json(response);
  }

  public async getBookingStatistics(req: Request, res: Response): Promise<void> {
    const statistics = await this.bookingService.getBookingStatistics();

    const response: ApiResponse = {
      success: true,
      data: statistics
    };

    res.json(response);
  }

  public async getBookingById(req: Request, res: Response): Promise<void> {
    const bookingId = parseInt(req.params.bookingId);
    const booking = await this.bookingService.getBookingById(bookingId);

    const response: ApiResponse = {
      success: true,
      data: booking
    };

    res.json(response);
  }
} 