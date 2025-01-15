import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { CreateWordDto } from '../src/modules/words/dto/word.dto';
import { CreatePracticeSessionDto } from '../src/modules/practice/dto/practice.dto';
import { LearningStyle, Difficulty, PracticeSessionType, ReviewType, PracticeWordPerformance, ProficiencyLevel } from '@vocabuddy/types';
import { DataSource } from 'typeorm';

describe('User-Word-Practice Flow (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let authToken: string;
  let userId: string;
  let wordIds: string[] = [];
  let practiceSessionId: string;

  const testUser = {
    email: 'test@example.com',
    password: 'Test123!',
    username: 'testuser',
    name: 'testuser',
    languages: [],
    premium: {
      isActive: false,
      plan: 'free',
      features: [],
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
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
      theme: 'light',
      fontScale: 'small',
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
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    
    dataSource = moduleFixture.get<DataSource>(DataSource);
    await dataSource.synchronize(true); // Drop and recreate all tables

    await app.init();
  });

  afterAll(async () => {
    await dataSource.dropDatabase(); // Clean up the database
    await dataSource.destroy(); // Close the connection
    await app.close();
  });

  describe('1. Authentication Flow', () => {
    it('should register a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: testUser.email,
          password: testUser.password,
          username: testUser.username,
          name: testUser.name
        })
        .expect(201);

      expect(response.body).toHaveProperty('access_token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user).toHaveProperty('id');
      
      userId = response.body.user.id;
      authToken = response.body.access_token;
    });

    it('should update user settings', async () => {
      const updateData = {
        settings: {
          learningStyle: [LearningStyle.VISUAL, LearningStyle.AUDITORY],
          difficulty: Difficulty.MEDIUM,
        }
      };

      await request(app.getHttpServer())
        .patch(`/users/${userId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
    });
  });

  describe('2. Word Management Flow', () => {
    const createWordDto: Omit<CreateWordDto, 'userId'> = {
      word: 'test',
      nativeLanguage: 'en',
      targetLanguages: [
        {
          name: 'English',
          code: 'en',
          native: false,
          proficiency: ProficiencyLevel.A1,
          startedAt: new Date(),
          lastStudied: new Date(),
        }
      ],
      learningStyle: [LearningStyle.VISUAL],
      difficulty: Difficulty.EASY,
      appLanguage: 'en',
    };

    it('should create 10 words', async () => {
      for (let i = 1; i <= 10; i++) {
        const response = await request(app.getHttpServer())
          .post('/words')
          .set('Authorization', `Bearer ${authToken}`)
          .send({
            ...createWordDto,
            word: `test${i}`,
            translations: [{ language: 'es', translation: `prueba${i}` }],
            pronunciation: `/tɛst${i}/`,
            wordType: ['noun'],
            definitions: [
              {
                partOfSpeech: 'noun',
                meaning: `Test word ${i}`,
                examples: [`Example ${i}`]
              }
            ],
            examples: [`Example sentence ${i}`],
            category: [{ name: 'Test', description: 'Test category' }],
            context: {
              sentences: [`Context sentence ${i}`],
              usageNotes: 'Test usage',
              difficulty: 'easy',
              tags: ['test'],
              tips: ['Test tip']
            },
            etymology: {
              origin: 'Test origin',
              history: 'Test history'
            },
            synonymsAntonyms: {
              synonyms: ['test'],
              antonyms: []
            }
          })
          .expect(201);

        expect(response.body).toHaveProperty('id');
        wordIds.push(response.body.id);
      }

      expect(wordIds).toHaveLength(10);
    }, 30000);

    it('should update 5 words', async () => {
      const updateData = {
        pronunciation: 'updated pronunciation',
        examples: ['updated example'],
      };

      for (let i = 0; i < 5; i++) {
        await request(app.getHttpServer())
          .patch(`/words/${wordIds[i]}`)
          .set('Authorization', `Bearer ${authToken}`)
          .send(updateData)
          .expect(200);
      }
    });

    it('should delete 5 words', async () => {
      for (let i = 5; i < 10; i++) {
        await request(app.getHttpServer())
          .delete(`/words/${wordIds[i]}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      }

      wordIds = wordIds.slice(0, 5);
    });
  });

  describe('3. Practice Session Flow', () => {
    it('should create practice session with 5 words', async () => {
      // First verify we have valid word IDs
      const wordResponses = await Promise.all(
        wordIds.map(wordId =>
          request(app.getHttpServer())
            .get(`/words/${wordId}`)
            .set('Authorization', `Bearer ${authToken}`)
            .expect(200)
        )
      );

      expect(wordResponses).toHaveLength(5);
      wordIds = wordResponses.map(response => response.body.id);

      const createSessionDto: CreatePracticeSessionDto = {
        words: wordIds.map(wordId => ({
          wordId,
          performance: PracticeWordPerformance.GOOD,
          timeSpent: 30,
          attempts: 1,
          metadata: {},
        })),
        sessionType: PracticeSessionType.FLASHCARD,
        duration: 300,
        score: 85,
        settings: {
          reviewType: ReviewType.SPACED,
          difficulty: Difficulty.MEDIUM,
          timeLimit: 300,
          wordsLimit: 10,
        },
        results: {
          totalWords: 5,
          correctWords: 4,
          incorrectWords: 1,
          accuracy: 0.8,
          averageTimePerWord: 30,
          streak: 3,
          xpEarned: 100,
        },
      };

      const response = await request(app.getHttpServer())
        .post('/practice/sessions')
        .set('Authorization', `Bearer ${authToken}`)
        .send(createSessionDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      practiceSessionId = response.body.id;
    }, 15000); // Add timeout for practice session creation

    it('should update session words performance', async () => {
      // First verify the session exists
      await request(app.getHttpServer())
        .get(`/practice/sessions/${practiceSessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const wordId = wordIds[0];
      const updateData = {
        timeSpent: 45,
        metadata: { notes: 'Improved performance' },
      };

      await request(app.getHttpServer())
        .post(`/practice/sessions/${practiceSessionId}/words/${wordId}/practice`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
    }, 10000);

    it('should update session details', async () => {
      // First verify the session exists
      await request(app.getHttpServer())
        .get(`/practice/sessions/${practiceSessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const updateData = {
        score: 90,
        duration: 350,
        results: {
          totalWords: 5,
          correctWords: 5,
          incorrectWords: 0,
          accuracy: 1.0,
          averageTimePerWord: 35,
          streak: 4,
          xpEarned: 120,
        },
      };

      await request(app.getHttpServer())
        .patch(`/practice/sessions/${practiceSessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);
    }, 10000);

    it('should end session successfully', async () => {
      // First verify the session exists
      await request(app.getHttpServer())
        .get(`/practice/sessions/${practiceSessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      await request(app.getHttpServer())
        .delete(`/practice/sessions/${practiceSessionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);
    }, 10000);
  });
}); 