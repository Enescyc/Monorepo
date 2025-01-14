import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { databaseConfig } from './config/database.config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuthMiddleware } from './common/middleware/auth.middleware';
import { JwtModule } from '@nestjs/jwt';
import { PracticeModule } from './modules/practice/practice.module';
import { UsersModule } from './modules/users/users.module';
import { WordsModule } from './modules/words/words.module';
import { AIModule } from './modules/ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    CacheModule.register(),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        ...databaseConfig(),
        type: 'postgres',
      }),
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRATION') || '1h',
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    WordsModule,
    PracticeModule,
    AIModule,
  ],
  controllers:[],
  providers: [AuthMiddleware],
})
export class AppModule {}
