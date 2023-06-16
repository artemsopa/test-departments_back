import 'reflect-metadata';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { EmployeesController } from '@/controllers/EmployeesController';
import { AuthController } from '@/controllers/AuthController';
import { EmployeesService } from '@/services/EmployeesService';
import { AuthService } from '@/services/AuthService';
import { Employee } from '@/entities/Employee';
import { User } from '@/entities/User';
import { LinkRouter } from '@/utils/LinkRouter';
import { Jwt } from '@/utils/Jwt';
import { App } from '@/App';

const main = async () => {
  try {
    dotenv.config();

    const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;
    const ds = new DataSource({
      type: 'postgres',
      host: DB_HOST,
      port: +DB_PORT,
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      entities: [User, Employee],
      synchronize: false,
      logging: true,
    });

    await ds.initialize();

    const { JWT_SECRET } = process.env;
    const jwt = new Jwt(JWT_SECRET);

    const authService = new AuthService(jwt, ds);
    const employeesService = new EmployeesService(ds);

    const linkRouter = new LinkRouter(jwt);

    const authController = new AuthController(authService, linkRouter);
    const employeesController = new EmployeesController(
      employeesService,
      linkRouter,
    );

    const { PORT } = process.env;
    const app = new App(+PORT, authController, employeesController);

    app.listen();
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
