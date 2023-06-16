import { RequestHandler } from 'express';

export interface LinkInput {
  isAuth?: true;
  route: RequestHandler;
}
