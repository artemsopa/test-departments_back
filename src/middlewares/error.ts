import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { ApiError } from '@/utils/ApiError';

export const error: ErrorRequestHandler = (error, req, res, next) => {
  if (error instanceof ApiError) {
    return res.status(error.status).json({ message: error.message });
  }
  if (error instanceof ZodError) {
    return res.status(400).json({
      message: error.errors.map((err) => err.message).join(' '),
      errors: error.errors,
    });
  }
  return res.status(500).json({ message: 'Internal server error!' });
};
