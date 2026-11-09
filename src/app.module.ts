import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from 'nestjs-pino';
import { validate, Environment } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { HotelsModule } from './hotels/hotels.module';
import { Hotel } from './hotels/entities/hotel.entity';
import { RoomType } from './hotels/entities/room-type.entity';
import { Reservation } from './hotels/entities/reservation.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
      envFilePath: ['.env'],
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const isDev = configService.get<string>('NODE_ENV') === Environment.Development;
        const logLevel = configService.get<string>('LOG_LEVEL', 'info');

        return {
          pinoHttp: {
            level: logLevel,
            transport: isDev
              ? {
                  target: 'pino-pretty',
                  options: {
                    colorize: true,
                    singleLine: true,
                    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss.l',
                  },
                }
              : undefined,
            autoLogging: true,
          },
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Hotel, RoomType, Reservation],
        synchronize: false, // MANDATORY: migrations only
        logging: configService.get<string>('NODE_ENV') === 'development',
      }),
    }),
    HealthModule,
    HotelsModule,
  ],
})
export class AppModule {}
