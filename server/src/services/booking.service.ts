import { Repository } from 'typeorm';
import { Booking } from '../entities/Booking';
import { AppDataSource } from '../data-source';
import { AppError, ErrorCode } from '../types';
import { UserService } from './user.service';
import { CarService } from './car.service';
import { PricingService } from './pricing.service';
import dayjs from 'dayjs';

export interface CreateBookingRequest {
  userId: number;
  carId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  averagePrice: number;
}

export class BookingService {
  private bookingRepository: Repository<Booking>;
  private userService: UserService;
  private carService: CarService;
  private pricingService: PricingService;

  constructor() {
    this.bookingRepository = AppDataSource.getRepository(Booking);
    this.userService = new UserService();
    this.carService = new CarService();
    this.pricingService = new PricingService();
  }

  public async createBooking(request: CreateBookingRequest): Promise<Booking> {
    this.validateDateRange(request.startDate, request.endDate);

    const [user, car] = await Promise.all([
      this.userService.getUserById(request.userId),
      this.carService.getCarById(request.carId)
    ]);

    this.userService.validateLicense(user, request.endDate);

    await this.validateBookingConflicts(request);

    await this.validatePricing(request, car);

    const booking = this.bookingRepository.create({
      user_id: request.userId,
      car_id: request.carId,
      start_date: new Date(request.startDate),
      end_date: new Date(request.endDate),
      total_price: request.totalPrice,
      average_price: request.averagePrice
    });

    try {
      return await this.bookingRepository.save(booking);
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to create booking',
        500
      );
    }
  }

  public async getBookingById(bookingId: number): Promise<Booking> {
    const booking = await this.bookingRepository.findOne({
      where: { book_id: bookingId },
      relations: ['user', 'car', 'car.model']
    });

    if (!booking) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        `Booking with ID ${bookingId} not found`,
        404
      );
    }

    return booking;
  }

  public async getUserBookings(userId: number): Promise<Booking[]> {
    return await this.bookingRepository.find({
      where: { user_id: userId },
      relations: ['car', 'car.model'],
      order: { start_date: 'DESC' }
    });
  }

  public async cancelBooking(bookingId: number, userId: number): Promise<void> {
    const booking = await this.getBookingById(bookingId);

    if (booking.user_id !== userId) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'You can only cancel your own bookings',
        403
      );
    }

    const today = dayjs();
    const startDate = dayjs(booking.start_date);

    if (startDate.isBefore(today)) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Cannot cancel bookings that have already started',
        400
      );
    }

    await this.bookingRepository.remove(booking);
  }

  public async getBookingStatistics(): Promise<{
    totalBookings: number;
    activeBookings: number;
    upcomingBookings: number;
    completedBookings: number;
  }> {
    const today = new Date();
    
    const [
      totalBookings,
      activeBookings,
      upcomingBookings,
      completedBookings
    ] = await Promise.all([
      this.bookingRepository.count(),
      this.bookingRepository.count({
        where: {
          start_date: dayjs().format('YYYY-MM-DD') as any,
          end_date: dayjs().format('YYYY-MM-DD') as any
        }
      }),
      this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.start_date > :today', { today })
        .getCount(),
      this.bookingRepository
        .createQueryBuilder('booking')
        .where('booking.end_date < :today', { today })
        .getCount()
    ]);

    return {
      totalBookings,
      activeBookings,
      upcomingBookings,
      completedBookings
    };
  }

  private validateDateRange(startDate: string, endDate: string): void {
    const start = dayjs(startDate);
    const end = dayjs(endDate);

    if (!start.isValid() || !end.isValid()) {
      throw new AppError(
        ErrorCode.INVALID_DATE_RANGE,
        'Invalid date format',
        400
      );
    }

    if (end.isBefore(start)) {
      throw new AppError(
        ErrorCode.INVALID_DATE_RANGE,
        'End date cannot be before start date',
        400
      );
    }

    const maxBookingDays = 365;
    if (start.diff(dayjs(), 'days') > maxBookingDays) {
      throw new AppError(
        ErrorCode.INVALID_DATE_RANGE,
        `Bookings cannot be made more than ${maxBookingDays} days in advance`,
        400
      );
    }
  }

  private async validateBookingConflicts(request: CreateBookingRequest): Promise<void> {
    const hasUserConflict = await this.userService.hasConflictingBookings(
      request.userId,
      request.startDate,
      request.endDate
    );

    if (hasUserConflict) {
      throw new AppError(
        ErrorCode.BOOKING_CONFLICT,
        'You already have a booking for these dates',
        400
      );
    }

    const isCarAvailable = await this.carService.isCarAvailable(
      request.carId,
      request.startDate,
      request.endDate
    );

    if (!isCarAvailable) {
      throw new AppError(
        ErrorCode.BOOKING_CONFLICT,
        'This car is not available for the selected dates',
        400
      );
    }
  }

  private async validatePricing(request: CreateBookingRequest, car: any): Promise<void> {
    const calculatedPricing = this.pricingService.calculatePricing(
      request.startDate,
      request.endDate,
      car.model
    );

    const tolerance = 0.01;
    
    if (
      Math.abs(calculatedPricing.totalPrice - request.totalPrice) > tolerance ||
      Math.abs(calculatedPricing.averagePrice - request.averagePrice) > tolerance
    ) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Price validation failed. Please refresh and try again.',
        400
      );
    }
  }
} 