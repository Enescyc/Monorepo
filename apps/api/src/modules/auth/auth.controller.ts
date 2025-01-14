import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto} from './dto/auth.dto';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { User as UserEntity } from '../users/entities/user.entity';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ 
    summary: 'Register a new user',
    description: 'Create a new user account with profile settings'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'User registered successfully',
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "user-uuid",
          email: "john@example.com",
          username: "johndoe"
        }
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Email already exists' })
  @ApiBody({
    type: RegisterDto,
    examples: {
      newUser: {
        value: {
          name: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          password: "securePassword123"
        },
        description: "Example of registering a new user"
      }
    }
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.username
    );
  }

  @Post('login')
  @ApiOperation({ 
    summary: 'Login user',
    description: 'Authenticate user and get access token'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Login successful',
    schema: {
      example: {
        accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        user: {
          id: "user-uuid",
          email: "john@example.com",
          username: "johndoe"
        }
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      example: {
        statusCode: 401,
        message: "Invalid email or password",
        error: "Unauthorized"
      }
    }
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      credentials: {
        value: {
          email: "john@example.com",
          password: "123"
        },
        description: "Login credentials"
      }
    }
  })
  async login(@Body() user: LoginDto) {
    console.log(user);
    return await this.authService.login(user);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ 
    summary: 'Get current user profile',
    description: 'Get authenticated user profile information'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Current user profile',
    schema: {
      example: {
        id: "user-uuid",
        email: "john@example.com",
        username: "johndoe"
      }
    }
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        statusCode: 401,
        message: "Unauthorized",
        error: "Unauthorized"
      }
    }
  })
  async getCurrentUser(@User() user: UserEntity) {
    console.log(user);
    return user;
  }
} 