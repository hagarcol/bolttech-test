import { Request, Response } from 'express';
import { CarService } from '../services/car.service';
import { UserService } from '../services/user.service';
import { ApiResponse } from '../types';
import { SearchAvailableCarsDto } from '../dtos/booking.dto';

export class AvailableCarsController {
  private carService: CarService;
  private userService: UserService;

  constructor() {
    this.carService = new CarService();
    this.userService = new UserService();
  }

  public async getAvailableCars(req: Request, res: Response): Promise<void> {
    const { email, start_date, end_date, expire_date } = req.body as SearchAvailableCarsDto;

    const user = await this.userService.findOrCreateUser(email, expire_date);

    this.userService.validateLicense(user, end_date);

    const hasConflicts = await this.userService.hasConflictingBookings(
      user.user_id,
      start_date,
      end_date
    );

    if (hasConflicts) {
      const response: ApiResponse = {
        success: false,
        error: 'BOOKING_CONFLICT',
        message: 'You already have a booking for these dates',
        data: {
          user_id: user.user_id,
          bookingList: user
        }
      };
      res.status(400).json(response);
      return;
    }

    const availableCars = await this.carService.findAvailableCars(start_date, end_date);

    const formattedCars = availableCars.map(car => ({
      car_id: car.carId,
      brand: car.brand,
      model_name: car.modelName,
      model_id: car.modelId,
      count: car.availableCount,
      total_price: car.totalPrice.toFixed(2),
      average_price: car.averagePrice.toFixed(2)
    }));

    const response: ApiResponse = {
      success: true,
      data: {
        available: formattedCars,
        user_id: user.user_id,
        bookingList: user
      }
    };

    res.json(response);
  }

  public async getCarStatistics(req: Request, res: Response): Promise<void> {
    const statistics = await this.carService.getCarStatistics();

    const response: ApiResponse = {
      success: true,
      data: statistics
    };

    res.json(response);
  }
} 