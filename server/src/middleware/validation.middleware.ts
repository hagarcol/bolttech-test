import { Request, Response, NextFunction } from 'express';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { AppError, ErrorCode } from '../types';

export function validationMiddleware<T>(
  type: any,
  skipMissingProperties = false
): (req: Request, res: Response, next: NextFunction) => void {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = plainToInstance(type, req.body);
      const errors = await validate(dto, { skipMissingProperties });
      
      if (errors.length > 0) {
        const message = errors
          .map((error) => Object.values(error.constraints || {}))
          .join(', ');
        
        throw new AppError(
          ErrorCode.INVALID_DATE_RANGE,
          `Validation failed: ${message}`,
          400
        );
      }
      
      req.body = dto;
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
} 