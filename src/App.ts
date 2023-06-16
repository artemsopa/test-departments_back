import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { Controller } from '@/controllers/Controller';
import { notFound } from '@/middlewares/notFound';
import { error } from '@/middlewares/error';

export class App {
  public app: Application;

  public constructor(
    private readonly port: number,
    ...controllers: Controller[]
  ) {
    this.app = express();
    this.app.use(express.json());
    this.app.use(cookieParser());
    this.app.use(
      cors({
        credentials: true,
        origin: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'PATCH'],
        preflightContinue: false,
        optionsSuccessStatus: 204,
      }),
    );

    this.initializeControllers(controllers);

    this.app.use(error);
    this.app.use(notFound);
  }

  private initializeControllers = (controllers: Controller[]) => {
    controllers.forEach((controller) => {
      this.app.use(controller.path, controller.router);
    });
  };

  public listen = () => {
    this.app.listen(this.port, () => {
      console.log(`App listening on "${this.port}" port...`);
    });
  };
}
