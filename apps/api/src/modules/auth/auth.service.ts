import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { AuthResponse, Difficulty, FontScale, Theme } from '@vocabuddy/types';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.usersService.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(dto?.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const payload = { email: user.email, sub: user.id };
    const { password, ...userWithoutPassword } = user;
    return {
      access_token: this.jwtService.sign(payload),
      user: userWithoutPassword as any, // TODO: fix this
    };
  }

  async register(email: string, password: string, username: string): Promise<AuthResponse> {
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({
      email,
      password: hashedPassword,
      username,
      name: username,
      languages: [],
      premium: {
        isActive: false,
        plan: 'free',
        features: [],
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
      settings: {
        dailyGoal: 0,
        studyReminders: {
          enabled: false,
          times: [],
          days: []
        },
        learningStyle: [],
        difficulty: Difficulty.EASY,
        notifications: {
          enabled: false,
          times: [],
          days: []
        },
        theme: Theme.LIGHT,
        fontScale: FontScale.SMALL,
        metadata: {
          lastActive: new Date(),
          deviceInfo: {
            platform: '',
            version: '',
            devices: []
          }
        }
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
          level: 0,
          currentLevelProgress: 0
        }
      },
      isEmailVerified: false,
      achievements: [],
      metadata: {
        lastActive: new Date(),
        deviceInfo: {
          platform: '',
          version: '',
          devices: []
        }
      }
    });

    return this.login({ email, password });
  }
} 