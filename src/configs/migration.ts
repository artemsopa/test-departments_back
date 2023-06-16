import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } = process.env;

export default new DataSource({
  type: 'postgres',
  host: DB_HOST,
  port: +DB_PORT,
  username: DB_USER,
  password: DB_PASSWORD,
  database: DB_NAME,
  entities: [__dirname + '/../entities/**/*.js'],
  migrations: [__dirname + '/../../migrations/**/*.js'],
});
