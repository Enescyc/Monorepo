import { Injectable } from '@nestjs/common';
import { Difficulty } from '@vocabuddy/types';

@Injectable()
export class AppService {
  getHello(): string {
    return `Welcome to VocaBuddy API! ${Difficulty.EASY}`;
  }
}
