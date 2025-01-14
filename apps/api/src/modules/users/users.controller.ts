import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { User } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully', type: User })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      user: {
        value: {
          name: "John Doe",
          email: "john@example.com",
          username: "johndoe",
          password: "securePassword123",
          profile: {
            languages: ["EN", "ES"],
            premium: {
              isActive: false,
              plan: "free",
              expiresAt: new Date(),
              features: []
            },
            settings: {
              theme: "light",
              notifications: true,
              studyReminders: true
            },
            progress: {
              overall: {
                totalWords: 0,
                masteredWords: 0,
                wordsInProgress: 0,
                totalStudyTime: 0
              },
              streak: {
                current: 0,
                longest: 0,
                lastStudyDate: new Date()
              },
              xp: {
                total: 0,
                level: 1,
                currentLevelProgress: 0
              }
            }
          }
        }
      }
    }
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  async findAll(): Promise<User[]> {
    return await this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({ status: 200, description: 'User found', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string): Promise<User> {
    return await this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
  @ApiBody({
    type: UpdateUserDto,
    examples: {
      update: {
        value: {
          name: "John Updated",
          username: "johnupdated",
          profile: {
            languages: ["EN", "FR"],
            settings: {
              theme: "dark",
              notifications: false
            }
          }
        }
      }
    }
  })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async remove(@Param('id') id: string): Promise<void> {
    return await this.usersService.remove(id);
  }
} 