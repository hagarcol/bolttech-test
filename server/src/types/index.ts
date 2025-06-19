// Common types and interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export enum Season {
  PEAK = 'peak',
  MID = 'mid',
  OFF = 'off'
}

export interface PricingResult {
  totalPrice: number;
  averagePrice: number;
  days: number;
}

export interface AvailableCarResult {
  carId: number;
  brand: string;
  modelName: string;
  modelId: number;
  availableCount: number;
  totalPrice: number;
  averagePrice: number;
}

export interface BookingValidationResult {
  isValid: boolean;
  errors: string[];
}

export enum ErrorCode {
  INVALID_DATE_RANGE = 'INVALID_DATE_RANGE',
  INVALID_LICENSE_DATE = 'INVALID_LICENSE_DATE',
  BOOKING_CONFLICT = 'BOOKING_CONFLICT',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  CAR_NOT_FOUND = 'CAR_NOT_FOUND',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    public message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'AppError';
  }
} 