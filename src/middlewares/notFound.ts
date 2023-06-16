import { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) =>
  res.status(404).json({ message: 'Not found!' });
