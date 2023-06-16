import { JwtTokenType } from '@/utils/JwtTokenType';

export interface JwtData {
  userId: string;
  type: JwtTokenType;
}
