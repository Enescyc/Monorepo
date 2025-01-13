import { DataSource } from 'typeorm';
import { typeOrmConfig } from './database.config';

export const AppDataSource = new DataSource({
  ...typeOrmConfig,
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/*{.ts,.js}'],
}); 