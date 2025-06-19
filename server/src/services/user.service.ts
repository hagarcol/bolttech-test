import { Repository } from 'typeorm';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { AppError, ErrorCode } from '../types';
import dayjs from 'dayjs';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  public async findOrCreateUser(
    email: string, 
    expireDate: string, 
    name: string = 'Default User'
  ): Promise<User> {
    try {
      let user = await this.userRepository.findOne({ 
        where: { email },
        relations: ['bookings', 'bookings.car', 'bookings.car.model']
      });

      if (user) {
        if (expireDate && user.expire_date.toString() !== expireDate) {
          user.expire_date = new Date(expireDate);
          user = await this.userRepository.save(user);
        }
        return user;
      }

      const newUser = this.userRepository.create({
        email,
        expire_date: new Date(expireDate),
        name,
        password: 'DefaultPassword'
      });

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new AppError(
        ErrorCode.INTERNAL_ERROR,
        'Failed to find or create user',
        500
      );
    }
  }

  public async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
      relations: ['bookings', 'bookings.car', 'bookings.car.model']
    });

    if (!user) {
      throw new AppError(
        ErrorCode.USER_NOT_FOUND,
        `User with ID ${userId} not found`,
        404
      );
    }

    return user;
  }

  public validateLicense(user: User, bookingEndDate: string): void {
    const licenseExpiryDate = dayjs(user.expire_date);
    const endDate = dayjs(bookingEndDate);

    if (licenseExpiryDate.isBefore(endDate)) {
      throw new AppError(
        ErrorCode.INVALID_LICENSE_DATE,
        'Driving license expires before the end of booking period',
        400
      );
    }
  }

  public async hasConflictingBookings(
    userId: number, 
    startDate: string, 
    endDate: string
  ): Promise<boolean> {
    const conflictingBookings = await this.userRepository
      .createQueryBuilder('user')
      .innerJoin('user.bookings', 'booking')
      .where('user.user_id = :userId', { userId })
      .andWhere(`(
        (booking.start_date <= :startDate AND booking.end_date >= :startDate)
        OR (booking.start_date <= :endDate AND booking.end_date >= :endDate)
        OR (booking.start_date >= :startDate AND booking.end_date <= :endDate)
      )`, { startDate, endDate })
      .getCount();

    return conflictingBookings > 0;
  }

  public async getUserBookings(userId: number): Promise<User> {
    return await this.getUserById(userId);
  }
} 