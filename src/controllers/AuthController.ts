import { RequestHandler } from 'express';
import { Controller } from '@/controllers/Controller';
import { AuthService } from '@/services/AuthService';
import { authInputSchema, AuthInputDto } from '@/dtos/AuthInput';
import { LinkRouter } from '@/utils/LinkRouter';
import { ApiError } from '@/utils/ApiError';
import { JwtGeneratedTokens } from '@/types/JwtGeneratedTokens';

export class AuthController extends Controller {
  constructor(
    private readonly authService: AuthService,
    private readonly linkRouter: LinkRouter,
  ) {
    super('/auth');

    this.initRoutes();
  }

  private initRoutes = () => {
    this.router.post('/login', this.linkRouter.link({ route: this.login }));
    this.router.post(
      '/register',
      this.linkRouter.link({ route: this.register }),
    );
    this.router.get('/refresh', this.linkRouter.link({ route: this.refresh }));
  };

  private login: RequestHandler = async (req, res) => {
    const input: AuthInputDto = authInputSchema.parse(req.body);

    const { accessToken, refreshToken }: JwtGeneratedTokens =
      await this.authService.login(input);

    res.cookie('refreshToken', refreshToken.token, {
      ...this.cookieOptions,
      expires: refreshToken.expiresIn,
    });

    return res.status(200).json({ accessToken });
  };

  private register: RequestHandler = async (req, res) => {
    const input: AuthInputDto = authInputSchema.parse(req.body);

    const { accessToken, refreshToken }: JwtGeneratedTokens =
      await this.authService.register(input);

    res.cookie('refreshToken', refreshToken.token, {
      ...this.cookieOptions,
      expires: refreshToken.expiresIn,
    });

    return res.status(201).json({ accessToken });
  };

  private refresh: RequestHandler = async (req, res) => {
    const token: string | undefined = req.cookies['refreshToken'];

    if (!token)
      throw ApiError.unauthorized(`Refresh token cookie doesn't exist`);

    const { accessToken, refreshToken }: JwtGeneratedTokens =
      await this.authService.refreshTokens(token);

    res.cookie('refreshToken', refreshToken.token, {
      ...this.cookieOptions,
      expires: refreshToken.expiresIn,
    });

    return res.status(200).json({ accessToken });
  };
}
