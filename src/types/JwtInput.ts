import { JwtTokenType } from '@/utils/JwtTokenType';

export interface JwtInput {
  id: string;
  type: JwtTokenType;
  expiresIn: string;
}
