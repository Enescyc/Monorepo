import { BaseEntity } from '../common/base';

export enum FeedbackType {
  GENERAL = 'general',
  BUG = 'bug',
  FEATURE = 'feature',
}

export enum FeedbackStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  RESOLVED = 'resolved'
}

export interface Feedback extends BaseEntity {
  userId: string;
  type: FeedbackType;
  message: string;
  userEmail?: string;
  displayName?: string;
  status: FeedbackStatus;
  deviceInfo?: {
    platform: string;
    version: string;
  };
} 