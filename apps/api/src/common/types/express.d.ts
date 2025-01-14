import { User } from '../../modules/users/entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
} 