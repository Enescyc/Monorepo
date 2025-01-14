import { Module } from '@nestjs/common';
import { OpenAIService } from './services/openai.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [ConfigModule,CacheModule.register()],
  controllers: [],
  providers: [OpenAIService],
  exports: [OpenAIService],
})
export class AIModule {} 