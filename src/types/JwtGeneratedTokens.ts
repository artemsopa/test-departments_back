import { JwtToken } from '@/types/JwtToken';

export interface JwtGeneratedTokens {
  accessToken: string;
  refreshToken: JwtToken;
}
