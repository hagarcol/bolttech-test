import { Repository } from 'typeorm';
import { Car } from '../entities/Car';
import { AppDataSource } from '../data-source';
import { AppError, ErrorCode, AvailableCarResult } from '../types';
import { PricingService } from './pricing.service';

export class CarService {
  private carRepository: Repository<Car>;
  private pricingService: PricingService;

  constructor() {
    this.carRepository = AppDataSource.getRepository(Car);
    this.pricingService = new PricingService();
  }

  public async findAvailableCars(
    startDate: string,
    endDate: string
  ): Promise<AvailableCarResult[]> {
    try {
      const availableCars = await this.carRepository
        .createQueryBuilder('cars')
        .innerJoin('cars.model', 'models')
        .select([
          'cars.brand AS brand',
          'cars.model_id AS model_id', 
          'MIN(cars.car_id) AS car_id',
          'models.model_name AS model_name',
          'models.price_peak AS price_peak',
          'models.price_mid AS price_mid',
          'models.price_off AS price_off',
          'COUNT(cars.car_id) AS count'
        ])
        .where(qb => {
          const subQuery = qb
            .subQuery()
            .select('bookings.car_id')
            .from('bookings', 'bookings')
            .where(`(
              (bookings.start_date <= :startDate AND bookings.end_date >= :startDate)
              OR (bookings.start_date <= :endDate AND bookings.end_date >= :endDate)
              OR (bookings.start_date >= :startDate AND bookings.end_date <= :endDate)
            )`, { startDate, endDate })
            .getQuery();
          return 'cars.car_id NOT IN ' + subQuery;
        })
        .groupBy('cars.model_id')
        .addGroupBy('cars.brand')
        .addGroupBy('models.model_name')
        .addGroupBy('models.price_peak')
        .addGroupBy('models.price_mid')
        .addGroupBy('models.price_off')
        .getRawMany();

      return this.enrichWithPricing(availableCars, startDate, endDate);
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to fetch available cars',
        500
      );
    }
  }

  public async getCarById(carId: number): Promise<Car> {
    const car = await this.carRepository.findOne({
      where: { car_id: carId },
      relations: ['model']
    });

    if (!car) {
      throw new AppError(
        ErrorCode.CAR_NOT_FOUND,
        `Car with ID ${carId} not found`,
        404
      );
    }

    return car;
  }

  public async isCarAvailable(
    carId: number,
    startDate: string,
    endDate: string
  ): Promise<boolean> {
    const conflictingBookings = await this.carRepository
      .createQueryBuilder('car')
      .innerJoin('car.bookings', 'booking')
      .where('car.car_id = :carId', { carId })
      .andWhere(`(
        (booking.start_date <= :startDate AND booking.end_date >= :startDate)
        OR (booking.start_date <= :endDate AND booking.end_date >= :endDate)
        OR (booking.start_date >= :startDate AND booking.end_date <= :endDate)
      )`, { startDate, endDate })
      .getCount();

    return conflictingBookings === 0;
  }

  public async getCarsByModel(modelId: number): Promise<Car[]> {
    return await this.carRepository.find({
      where: { model_id: modelId },
      relations: ['model']
    });
  }

  private enrichWithPricing(
    cars: any[], 
    startDate: string, 
    endDate: string
  ): AvailableCarResult[] {
    return cars.map((car: any) => {
      const modelData = {
        model_id: car.model_id,
        model_name: car.model_name,
        price_peak: car.price_peak,
        price_mid: car.price_mid,
        price_off: car.price_off
      };

      const pricing = this.pricingService.calculatePricing(
        startDate,
        endDate,
        modelData as any
      );

      return {
        carId: car.car_id,
        brand: car.brand,
        modelName: car.model_name,
        modelId: car.model_id,
        availableCount: car.count,
        totalPrice: pricing.totalPrice,
        averagePrice: pricing.averagePrice
      };
    });
  }

  public async getCarStatistics(): Promise<{
    totalCars: number;
    availableToday: number;
    bookedToday: number;
  }> {
    const today = new Date().toISOString().split('T')[0];
    
    const totalCars = await this.carRepository.count();
    const availableCars = await this.findAvailableCars(today, today);
    const availableToday = availableCars.reduce((sum, car) => sum + car.availableCount, 0);
    
    return {
      totalCars,
      availableToday,
      bookedToday: totalCars - availableToday
    };
  }
} 