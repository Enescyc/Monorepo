import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { OpenAIService } from './modules/ai/services/openai.service';
import { Difficulty, LANGUAGES, LearningStyle, ProficiencyLevel } from '@vocabuddy/types';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): any {
    return this.appService.getHello();
  }

  @Get('health')
  healthCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }
} 