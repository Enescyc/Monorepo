import { User } from '../user';

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: User;
} 