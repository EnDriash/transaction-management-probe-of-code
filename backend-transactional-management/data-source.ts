require('module-alias/register')
import path from 'path';
import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'), // Provide a default value for DB_PORT
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'accounting',
    entities: [ path.join( __dirname, 'src/**/*.entity{.ts,.js}')],
    migrations: [path.join( __dirname,'src/shared/database/migrations/*.ts')],
    synchronize: false,
});

AppDataSource.initialize()
  .then(() => {
    console.info('Data Source has been initialized!');
  })
  .catch((err) => {
    console.error('Error during Data Source initialization:', err);
  });