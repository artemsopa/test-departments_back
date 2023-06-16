import { DataSource, InsertResult, Repository } from 'typeorm';
import * as argon2 from 'argon2';
import { JwtGeneratedTokens } from '@/types/JwtGeneratedTokens';
import { JwtData } from '@/types/JwtData';
import { jwtConstants } from '@/constants/jwtConstants';
import { AuthInput } from '@/dtos/AuthInput';
import { User } from '@/entities/User';
import { JwtTokenType } from '@/utils/JwtTokenType';
import { ApiError } from '@/utils/ApiError';
import { Jwt } from '@/utils/Jwt';

export class AuthService {
  private readonly usersRepository: Repository<User>;

  public constructor(private readonly jwt: Jwt, ds: DataSource) {
    this.usersRepository = ds.getRepository(User);
  }

  public register = async ({
    username,
    password,
  }: AuthInput): Promise<JwtGeneratedTokens> => {
    const user: User | null = await this.usersRepository.findOneBy({
      username,
    });

    if (user) {
      throw ApiError.unauthorized('Username already exists');
    }

    const hashedPassword: string = await argon2.hash(password);

    const {
      raw: [{ id }],
    }: InsertResult = await this.usersRepository.insert({
      username,
      password: hashedPassword,
    });

    const jwtGeneratedTokens: JwtGeneratedTokens = this.generateJwtTokens(id);

    return jwtGeneratedTokens;
  };

  public login = async ({
    username,
    password,
  }: AuthInput): Promise<JwtGeneratedTokens> => {
    const user: User | null = await this.usersRepository.findOneBy({
      username,
    });
    if (!user) {
      throw ApiError.unauthorized('Unknown username');
    }

    const isPasswordValid: boolean = await argon2.verify(
      user.password,
      password,
    );

    if (!isPasswordValid) {
      throw ApiError.unauthorized('Incorrect password');
    }

    const jwtGeneratedTokens: JwtGeneratedTokens = this.generateJwtTokens(
      user.id,
    );

    return jwtGeneratedTokens;
  };

  public refreshTokens = async (
    refreshToken: string,
  ): Promise<JwtGeneratedTokens> => {
    const { userId }: JwtData = this.jwt.verifyToken(
      refreshToken,
      JwtTokenType.REFRESH,
    );

    const user: User | null = await this.usersRepository.findOneBy({
      id: userId,
    });

    if (!user) {
      throw ApiError.unauthorized(`Unknown refresh token`);
    }

    const jwtGeneratedTokens: JwtGeneratedTokens = this.generateJwtTokens(
      user.id,
    );

    return jwtGeneratedTokens;
  };

  private generateJwtTokens = (id: string): JwtGeneratedTokens => {
    const accessToken: string = this.jwt.createToken({
      id,
      type: JwtTokenType.ACCESS,
      expiresIn: jwtConstants.ACCESS_TOKEN_TIME,
    });

    const refreshToken: string = this.jwt.createToken({
      id,
      type: JwtTokenType.REFRESH,
      expiresIn: jwtConstants.REFRESH_TOKEN_TIME,
    });

    const expiresInRefreshToken: Date = new Date();

    expiresInRefreshToken.setHours(
      expiresInRefreshToken.getHours() +
        jwtConstants.REFRESH_TOKEN_EXPIRES_IN_HOURS,
    );

    const tokens: JwtGeneratedTokens = {
      accessToken,
      refreshToken: {
        token: refreshToken,
        expiresIn: expiresInRefreshToken,
      },
    };

    return tokens;
  };
}
