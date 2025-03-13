import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/AppError';

export function errorMiddleware(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}
