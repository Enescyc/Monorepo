# Dashboard Backend Implementation Guide

## Overview
This document outlines the necessary backend implementations required to support the VocaBuddy dashboard functionality. The dashboard displays user progress, practice sessions, achievements, and language learning statistics.

## Required API Endpoints

### 1. User Dashboard Data
```typescript
GET /api/dashboard
Response: {
  user: {
    name: string;
    progress: {
      overall: {
        totalWords: number;
        masteredWords: number;
        wordsInProgress: number;
        totalStudyTime: number;
      };
      streak: {
        current: number;
        longest: number;
        lastStudyDate: Date;
      };
      xp: {
        total: number;
        level: number;
        currentLevelProgress: number;
      };
    };
    languages: Array<{
      name: string;
      code: string;
      progress: number;
    }>;
  };
  recentSessions: Array<{
    sessionType: PracticeSessionType;
    duration: number;
    score: number;
    results: {
      totalWords: number;
      correctWords: number;
      incorrectWords: number;
      accuracy: number;
      averageTimePerWord: number;
      streak: number;
      xpEarned: number;
    };
    createdAt: Date;
  }>;
  achievements: Array<{
    title: string;
    description: string;
    type: AchievementType;
    earnedAt: Date;
    xpEarned: number;
  }>;
}
```

### 2. Progress Tracking
```typescript
GET /api/progress/stats
Response: {
  daily: Array<{
    date: Date;
    wordsLearned: number;
    timeSpent: number;
    xpEarned: number;
  }>;
  weekly: {
    totalWords: number;
    averageAccuracy: number;
    totalTimeSpent: number;
    totalXP: number;
  };
  trends: {
    wordProgress: number; // Percentage increase/decrease
    accuracyChange: number;
    streakChange: number;
  };
}
```

### 3. Language-specific Progress
```typescript
GET /api/languages/{languageCode}/progress
Response: {
  overview: {
    totalWords: number;
    masteredWords: number;
    wordsInProgress: number;
    accuracy: number;
  };
  categories: Array<{
    name: string;
    wordsCount: number;
    masteredCount: number;
    progress: number;
  }>;
  recentWords: Array<{
    word: string;
    translation: string;
    mastery: number;
    lastPracticed: Date;
  }>;
}
```

## Database Schema Updates

### 1. User Progress Tracking
```typescript
// Add to User entity
@Entity()
class User {
  // ... existing fields

  @Column(() => UserProgress)
  progress: UserProgress;

  @Column(() => UserStreak)
  streak: UserStreak;

  @Column(() => UserXP)
  xp: UserXP;
}

@Entity()
class UserProgress {
  @Column()
  totalWords: number;

  @Column()
  masteredWords: number;

  @Column()
  wordsInProgress: number;

  @Column()
  totalStudyTime: number;
}

@Entity()
class UserStreak {
  @Column()
  current: number;

  @Column()
  longest: number;

  @Column()
  lastStudyDate: Date;
}

@Entity()
class UserXP {
  @Column()
  total: number;

  @Column()
  level: number;

  @Column()
  currentLevelProgress: number;
}
```

### 2. Language Progress Tracking
```typescript
@Entity()
class LanguageProgress {
  @ManyToOne(() => User)
  user: User;

  @ManyToOne(() => Language)
  language: Language;

  @Column()
  progress: number;

  @Column()
  lastPracticed: Date;

  @Column(() => CategoryProgress)
  categories: CategoryProgress[];
}

@Entity()
class CategoryProgress {
  @Column()
  name: string;

  @Column()
  wordsCount: number;

  @Column()
  masteredCount: number;

  @Column()
  progress: number;
}
```

## Service Implementations

### 1. Dashboard Service
```typescript
@Injectable()
export class DashboardService {
  constructor(
    private userService: UserService,
    private practiceService: PracticeService,
    private achievementService: AchievementService,
  ) {}

  async getUserDashboard(userId: string) {
    const [user, recentSessions, achievements] = await Promise.all([
      this.userService.getUserWithProgress(userId),
      this.practiceService.getRecentSessions(userId),
      this.achievementService.getRecentAchievements(userId),
    ]);

    return {
      user,
      recentSessions,
      achievements,
    };
  }

  async calculateUserProgress(userId: string) {
    // Implement progress calculation logic
  }

  async updateUserStreak(userId: string) {
    // Implement streak update logic
  }
}
```

### 2. Progress Service
```typescript
@Injectable()
export class ProgressService {
  async trackPracticeProgress(
    userId: string,
    practiceSession: PracticeSession,
  ) {
    // Update user progress
    // Update language progress
    // Calculate and award XP
    // Check and award achievements
  }

  async calculateLanguageProgress(
    userId: string,
    languageCode: string,
  ) {
    // Calculate overall language progress
    // Track category-wise progress
    // Update mastery levels
  }
}
```

## Required Backend Tasks

1. **Database Updates**
   - Implement new entities and relationships
   - Create migrations for schema changes
   - Add indexes for performance optimization

2. **API Development**
   - Implement all required endpoints
   - Add request validation
   - Implement error handling
   - Add response caching where appropriate

3. **Service Layer**
   - Implement progress tracking logic
   - Add streak calculation system
   - Create XP and leveling system
   - Implement achievement tracking

4. **Performance Optimizations**
   - Add database query optimizations
   - Implement caching strategy
   - Add pagination for large datasets
   - Optimize response payload size

5. **Testing**
   - Unit tests for services
   - Integration tests for APIs
   - Performance testing
   - Load testing for dashboard endpoints

## Security Considerations

1. **Authentication**
   - Ensure all dashboard endpoints require authentication
   - Implement rate limiting
   - Add request validation

2. **Data Access**
   - Implement proper authorization checks
   - Add user data isolation
   - Validate language access permissions

3. **Data Protection**
   - Implement data sanitization
   - Add input validation
   - Implement proper error handling

## Caching Strategy

1. **User Dashboard Data**
   ```typescript
   // Cache configuration
   const CACHE_TTL = {
     dashboard: 5 * 60, // 5 minutes
     progress: 15 * 60, // 15 minutes
     achievements: 30 * 60, // 30 minutes
   };

   // Implementation
   @Injectable()
   export class DashboardService {
     constructor(
       @Inject(CACHE_MANAGER)
       private cacheManager: Cache,
     ) {}

     async getUserDashboard(userId: string) {
       const cacheKey = `dashboard:${userId}`;
       const cached = await this.cacheManager.get(cacheKey);

       if (cached) {
         return cached;
       }

       const data = await this.fetchDashboardData(userId);
       await this.cacheManager.set(
         cacheKey,
         data,
         CACHE_TTL.dashboard,
       );

       return data;
     }
   }
   ```

## Implementation Phases

### Phase 1: Core Dashboard
1. Set up database schema
2. Implement basic API endpoints
3. Add progress tracking
4. Implement caching

### Phase 2: Enhanced Features
1. Add achievement system
2. Implement XP and leveling
3. Add detailed progress tracking
4. Implement streak system

### Phase 3: Optimization
1. Add performance optimizations
2. Implement advanced caching
3. Add real-time updates
4. Implement data aggregation

## Monitoring and Analytics

1. **Performance Metrics**
   - API response times
   - Database query performance
   - Cache hit rates
   - Error rates

2. **User Analytics**
   - Active users
   - Session duration
   - Feature usage
   - Progress metrics

3. **System Health**
   - Server resources
   - Database performance
   - Cache performance
   - API availability 