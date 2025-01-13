import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { AuthResponse } from '@vocabuddy/types';

interface RequestWithUser extends Request {
  user: User;
}

interface LoginDto {
  email: string;
  password: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  public async login(
    @Request() req: RequestWithUser,
    @Body() _loginDto: LoginDto // This ensures proper validation of the request body
  ): Promise<AuthResponse> {
    return await this.authService.login(req.user);
  }

  @Post('register')
  public async register(@Body() createUserDto: CreateUserDto): Promise<AuthResponse> {
    return await this.authService.register(
      createUserDto.email,
      createUserDto.password,
      createUserDto.username,
    );
  }
} 