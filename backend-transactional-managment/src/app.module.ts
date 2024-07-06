import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppService } from './app.service';
import { TransactionsModule } from './domains/transactions/transactions.module';
import { AccountsModule } from './domains/accounts/accounts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { LoggerMiddleware } from './shared/middlewares/httpLoger';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TransactionsModule, 
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT ?? 5432),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'accounting',
      autoLoadEntities: true,
      synchronize: true, // set to false in production
    }),
    AccountsModule],
  controllers: [HealthController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
