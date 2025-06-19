import { Request, Response, NextFunction } from 'express';
import { AppError, ErrorCode, ApiResponse } from '../types';

export function errorHandler(
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    timestamp: new Date().toISOString()
  });

  if (error instanceof AppError) {
    const response: ApiResponse = {
      success: false,
      error: error.code,
      message: error.message
    };

    res.status(error.statusCode).json(response);
    return;
  }

  if (error.name === 'ValidationError') {
    const response: ApiResponse = {
      success: false,
      error: ErrorCode.INVALID_DATE_RANGE,
      message: 'Validation failed'
    };

    res.status(400).json(response);
    return;
  }

  if (error.message.includes('ER_DUP_ENTRY')) {
    const response: ApiResponse = {
      success: false,
      error: ErrorCode.BOOKING_CONFLICT,
      message: 'Duplicate entry detected'
    };

    res.status(409).json(response);
    return;
  }

  const response: ApiResponse = {
    success: false,
    error: ErrorCode.INTERNAL_ERROR,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  };

  res.status(500).json(response);
}

export function notFoundHandler(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const response: ApiResponse = {
    success: false,
    error: ErrorCode.INTERNAL_ERROR,
    message: `Route ${req.originalUrl} not found`
  };

  res.status(404).json(response);
} 