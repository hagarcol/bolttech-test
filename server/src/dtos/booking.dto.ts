import { IsEmail, IsDateString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class SearchAvailableCarsDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email!: string;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  @IsNotEmpty({ message: 'Start date is required' })
  start_date!: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  @IsNotEmpty({ message: 'End date is required' })
  end_date!: string;

  @IsDateString({}, { message: 'License expiry date must be a valid date' })
  @IsNotEmpty({ message: 'License expiry date is required' })
  expire_date!: string;
}

export class CreateBookingDto {
  @IsNumber({}, { message: 'User ID must be a number' })
  @IsPositive({ message: 'User ID must be positive' })
  user_id!: number;

  @IsNumber({}, { message: 'Car ID must be a number' })
  @IsPositive({ message: 'Car ID must be positive' })
  car_id!: number;

  @IsDateString({}, { message: 'Start date must be a valid date' })
  start_date!: string;

  @IsDateString({}, { message: 'End date must be a valid date' })
  end_date!: string;

  @IsNumber({}, { message: 'Total price must be a number' })
  @IsPositive({ message: 'Total price must be positive' })
  total_price!: number;

  @IsNumber({}, { message: 'Average price must be a number' })
  @IsPositive({ message: 'Average price must be positive' })
  average_price!: number;
}

export class BookingResponseDto {
  book_id!: number;
  user_id!: number;
  car_id!: number;
  start_date!: string;
  end_date!: string;
  total_price!: number;
  average_price!: number;
  car!: {
    brand: string;
    model: {
      model_name: string;
    };
  };
}

export class AvailableCarResponseDto {
  car_id!: number;
  brand!: string;
  model_name!: string;
  model_id!: number;
  count!: number;
  total_price!: string;
  average_price!: string;
} 