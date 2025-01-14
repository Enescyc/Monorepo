import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/modules/users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers.authorization;
      if (!authHeader) {
        return next();
      }

      const token = authHeader.split(' ')[1];
      console.log('token', token);
      if (!token) {
        return next();
      }

      const secret = this.configService.get<string>('JWT_SECRET');
      console.log('secret', secret);
      const decoded = this.jwtService.verify(token, { secret });
      console.log('decoded', decoded);
      if (!decoded) {
        return next();
      }

      // Get user from database and attach to request
      const user = await this.usersService.findOne(decoded.sub);
      console.log('user', user);
      if (user) {
        // Create a new user object without the password
        const { password, ...userWithoutPassword } = user;
        // Attach user to request object
        req.user = userWithoutPassword as User;
      }

      next();
    } catch (error) {
      // If token is invalid, just continue without setting user
      console.error('Auth middleware error:', error);
      next();
    }
  }
} 