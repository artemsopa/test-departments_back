import { CookieOptions, Router } from 'express';

export abstract class Controller {
  public readonly path: string;
  public readonly router: Router = Router();
  public readonly cookieOptions: CookieOptions = {
    secure: true,
    httpOnly: true,
    sameSite: 'none',
  };

  public constructor(path: string) {
    this.path = path;
  }
}
