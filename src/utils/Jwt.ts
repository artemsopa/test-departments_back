import * as jwt from 'jsonwebtoken';
import { JwtInput } from '@/types/JwtInput';
import { JwtData } from '@/types/JwtData';
import { JwtTokenType } from '@/utils/JwtTokenType';
import { ApiError } from '@/utils/ApiError';

export class Jwt {
  public constructor(private readonly secret: string) {}

  public createToken = ({ id, type, expiresIn }: JwtInput) =>
    jwt.sign({ id, type }, this.secret, { expiresIn });

  public verifyToken = (token: string, type: JwtTokenType) => {
    try {
      const decoded: JwtData = jwt.verify(token, this.secret) as JwtData;

      if (decoded.type === type) return decoded;

      throw new Error('Wrong token type');
    } catch (e: any) {
      throw ApiError.unauthorized(`Can't verify token`);
    }
  };
}
