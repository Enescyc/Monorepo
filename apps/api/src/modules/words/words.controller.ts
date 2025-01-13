import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { WordsService } from './words.service';
import { CreateWordDto } from './dto/create-word.dto';
import { UpdateWordDto } from './dto/update-word.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LearningStatus, RequestWithUser } from '@vocabuddy/types';

@Controller('words')
@UseGuards(JwtAuthGuard)
export class WordsController {
  constructor(private readonly wordsService: WordsService) {}

  @Post()
  create(@Request() req: RequestWithUser, @Body() createWordDto: CreateWordDto) {
    return this.wordsService.create(req.user.id, createWordDto);
  }

  @Get()
  findAll(@Request() req: RequestWithUser) {
    return this.wordsService.findAll(req.user.id);
  }

  @Get('status/:status')
  findByStatus(
    @Request() req: RequestWithUser,
    @Param('status') status: LearningStatus,
  ) {
    return this.wordsService.findByStatus(req.user.id, status);
  }

  @Get(':id')
  findOne(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.wordsService.findOne(req.user.id, id);
  }

  @Patch(':id')
  update(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body() updateWordDto: UpdateWordDto,
  ) {
    return this.wordsService.update(req.user.id, id, updateWordDto);
  }

  @Delete(':id')
  remove(@Request() req: RequestWithUser, @Param('id') id: string) {
    return this.wordsService.remove(req.user.id, id);
  }

  @Patch(':id/status')
  updateStatus(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body('status') status: LearningStatus,
  ) {
    return this.wordsService.updateWordStatus(req.user.id, id, status);
  }

  @Patch(':id/mastery')
  updateMastery(
    @Request() req: RequestWithUser,
    @Param('id') id: string,
    @Body('score') score: number,
  ) {
    return this.wordsService.updateMasteryLevel(req.user.id, id, score);
  }
} 