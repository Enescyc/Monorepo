import { User } from '../user';

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    username: string;
    isPremium: boolean;
  };
}

export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RequestWithUser extends Request {
  user: User;
} 