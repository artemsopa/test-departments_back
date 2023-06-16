import { Request, RequestHandler } from 'express';
import { LinkInput } from '@/types/LinkInput';
import { JwtTokenType } from '@/utils/JwtTokenType';
import { ApiError } from '@/utils/ApiError';
import { Jwt } from '@/utils/Jwt';

export class LinkRouter {
  constructor(private readonly jwt: Jwt) {}

  public link =
    ({ isAuth, route }: LinkInput): RequestHandler =>
    async (req, res, next) => {
      try {
        if (isAuth) {
          const userId = this.getUserIdFromRequest(req);
          req.userId = userId;
        }
        await route(req, res, next);
      } catch (error) {
        next(error);
      }
    };

  private getUserIdFromRequest = (req: Request) => {
    const header = req.get('authorization');
    if (!header) {
      throw ApiError.unauthorized('Empty "Authorization" header');
    }

    const headerParts = header.split(' ');
    if (headerParts.length < 2 || headerParts[0] !== 'Bearer') {
      throw ApiError.unauthorized('Invalid "Authorization" header');
    }

    const { userId } = this.jwt.verifyToken(
      headerParts[1],
      JwtTokenType.ACCESS,
    );

    return userId;
  };
}
