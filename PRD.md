# Language Learning Application - Detaylı PRD

## 1. Proje Genel Bakış

### 1.1 Vizyon
Modern teknolojileri kullanarak, kişiselleştirilmiş ve etkili bir dil öğrenme deneyimi sunan, yapay zeka destekli bir platform geliştirmek.

### 1.2 Hedef Kitle
- Dil öğrenmeye yeni başlayanlar
- Mevcut dil seviyesini geliştirmek isteyenler
- Akademik dil öğrenimi yapanlar
- Profesyonel amaçlı dil öğrenenler
- Çoklu dil öğrenenler

## 2. Teknik Mimari

### 2.1 Frontend (Next.js Monorepo)

#### Teknoloji Yığını
- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS
- Shadcn/ui
- NextAuth.js
- Prisma (Client)
- TanStack Query
- Zustand
- React Hook Form + Zod

#### Monorepo Yapısı
```
apps/
├── web/                 # Ana web uygulaması
└── admin/              # Admin paneli
packages/
├── ui/                 # Shared UI components
├── config/             # Shared configurations
├── types/             # Shared TypeScript types
└── utils/             # Shared utilities
```

### 2.2 Backend (NestJS)

#### Teknoloji Yığını
- NestJS 10+
- TypeScript 5
- TypeORM
- PostgreSQL
- Local Cache (Custom implementation)
- OpenAI Integration
- JWT Authentication
- Winston Logger
- Class Validator
- Swagger/OpenAPI

#### Servis Mimarisi
```
src/
├── modules/
│   ├── auth/
│   ├── users/
│   ├── words/
│   ├── practice/
│   └── ai/
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── config/
└── shared/
```

## 3. Veritabanı Tasarımı

### 3.1 PostgreSQL Şeması
- Users & Authentication
- Words & Learning
- Practice & Progress
- Achievements & Gamification
- Settings & Preferences

### 3.2 Cache Stratejisi
- Sık erişilen kelimeler
- Kullanıcı istatistikleri
- AI yanıtları
- Session verileri

## 4. Core Özellikler

### 4.1 Authentication & Authorization
```typescript
// Frontend (NextAuth.js)
interface AuthConfig {
  providers: ['google', 'email'];
  session: 'jwt';
  pages: {
    signIn: string;
    error: string;
  };
  callbacks: {
    session: Function;
    jwt: Function;
  };
}

// Backend (NestJS)
interface JwtPayload {
  sub: string;
  email: string;
  roles: string[];
}
```

### 4.2 Kelime Yönetimi
```typescript
interface WordManagement {
  features: {
    aiGeneration: boolean;
    bulkImport: boolean;
    customCategories: boolean;
    pronunciationAudio: boolean;
    exampleSentences: boolean;
  };
  aiIntegration: {
    definitionGeneration: boolean;
    contextExamples: boolean;
    similarWords: boolean;
  };
}
```

### 4.3 Pratik Sistemi
```typescript
interface PracticeSystem {
  modes: {
    flashcards: boolean;
    quiz: boolean;
    writing: boolean;
    speaking: boolean;
    listening: boolean;
  };
  features: {
    spaceRepetition: boolean;
    progressTracking: boolean;
    aiAssessment: boolean;
  };
}
```

## 5. OpenAI Entegrasyonu

### 5.1 Kullanım Alanları
- Kelime açıklamaları
- Örnek cümle üretimi
- Pratik soruları
- İlerleme değerlendirmesi
- Kişiselleştirilmiş öneriler

### 5.2 Prompt Şablonları
```typescript
interface AIPrompts {
  wordDetail: (word: string, language: string) => string;
  generateExamples: (word: string, level: string) => string;
  createQuiz: (words: string[], difficulty: string) => string;
  assessProgress: (userStats: UserStats) => string;
}
```

## 6. API Tasarımı

### 6.1 Frontend API Routes (Next.js)
```typescript
// app/api/auth/[...nextauth]/route.ts
// app/api/words/route.ts
// app/api/practice/route.ts
// app/api/ai/route.ts
```

### 6.2 Backend API Endpoints (NestJS)
```typescript
// Authentication
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

// Words
GET    /api/v1/words
POST   /api/v1/words
GET    /api/v1/words/:id
PATCH  /api/v1/words/:id
DELETE /api/v1/words/:id

// Practice
POST   /api/v1/practice/start
PATCH  /api/v1/practice/:id/complete
GET    /api/v1/practice/history
GET    /api/v1/practice/recommendations

// AI
POST   /api/v1/ai/generate-word-details
POST   /api/v1/ai/generate-practice
POST   /api/v1/ai/assess-progress
```

## 7. Güvenlik ve Performance

### 7.1 Güvenlik Önlemleri
```typescript
interface SecurityMeasures {
  authentication: {
    jwtExpiration: '15m';
    refreshTokenExpiration: '7d';
    passwordHashAlgorithm: 'bcrypt';
  };
  rateLimit: {
    windowMs: 15 * 60 * 1000; // 15 minutes
    max: 100; // limit each IP to 100 requests per windowMs
  };
  helmet: {
    enabled: true;
    config: HelmetConfig;
  };
}
```

### 7.2 Performance Optimizasyonları
```typescript
interface PerformanceOptimizations {
  cache: {
    wordTTL: 3600; // 1 hour
    userStatsTTL: 300; // 5 minutes
    aiResponseTTL: 86400; // 24 hours
  };
  pagination: {
    defaultLimit: 20;
    maxLimit: 100;
  };
  imageOptimization: {
    quality: 80;
    formats: ['webp', 'avif'];
  };
}
```

## 8. Monitoring ve Logging

### 8.1 Logging Stratejisi
```typescript
interface LoggingStrategy {
  levels: ['error', 'warn', 'info', 'debug'];
  transports: ['console', 'file'];
  format: 'json';
}
```

### 8.2 Monitoring Metrikleri
```typescript
interface MonitoringMetrics {
  technical: {
    responseTime: number;
    errorRate: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  business: {
    activeUsers: number;
    practiceCompletionRate: number;
    wordLearningRate: number;
    userRetention: number;
  };
}
```

## 9. İyileştirme ve Geliştirme Planı

### 9.1 Faz 1: Temel Özellikler (2 ay)
- Authentication sistemi
- Temel kelime yönetimi
- Basit pratik modülleri
- Minimum AI entegrasyonu

### 9.2 Faz 2: Gelişmiş Özellikler (2 ay)
- İleri AI entegrasyonları
- Gelişmiş pratik modülleri
- Gamification sistemi
- Performance optimizasyonları

### 9.3 Faz 3: Premium Özellikler (2 ay)
- Özel AI asistanı
- İleri analitik
- Sosyal özellikler
- Mobile-first optimizasyonlar

## 10. Teknik Gereksinimler

### 10.1 Development Gereksinimleri
```bash
# Frontend
Node.js >= 18
pnpm >= 8
TypeScript >= 5

# Backend
Node.js >= 18
Nest CLI >= 10
PostgreSQL >= 15
```

### 10.2 Deployment Gereksinimleri
```typescript
interface DeploymentRequirements {
  frontend: {
    platform: 'Vercel';
    node: '18.x';
    memory: '1GB';
  };
  backend: {
    platform: 'AWS ECS';
    node: '18.x';
    memory: '2GB';
    cpu: '1 vCPU';
  };
  database: {
    platform: 'AWS RDS';
    type: 'PostgreSQL';
    size: 'db.t3.medium';
  };
}
```

## 11. Test Stratejisi

### 11.1 Frontend Tests
- Unit Tests (Jest)
- Component Tests (Testing Library)
- E2E Tests (Cypress)
- Performance Tests (Lighthouse)

### 11.2 Backend Tests
- Unit Tests (Jest)
- E2E Tests (Supertest)
- Integration Tests
- Load Tests (k6)

## 12. Dokümantasyon

### 12.1 API Dokümantasyonu
- Swagger/OpenAPI
- Postman Collection
- API Endpoints README

### 12.2 Teknik Dokümantasyon
- Setup Guide
- Architecture Overview
- Contributing Guidelines
- Security Guidelines