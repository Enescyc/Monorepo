import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { PracticeService } from './practice.service';
import { CreatePracticeDto } from './dto/create-practice.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestWithUser } from '@vocabuddy/types';

@Controller('practice')
@UseGuards(JwtAuthGuard)
export class PracticeController {
  constructor(private readonly practiceService: PracticeService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createPracticeDto: CreatePracticeDto) {
    return this.practiceService.create(req.user.id, createPracticeDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.practiceService.findAll(req.user.id);
  }

  @Get('word/:wordId')
  findByWord(@Request() req: RequestWithUser, @Param('wordId') wordId: string) {
    return this.practiceService.findByWord(req.user.id, wordId);
  }

  @Get('statistics')
  getStatistics(@Request() req: RequestWithUser) {
    return this.practiceService.getStatistics(req.user.id);
  }
} 