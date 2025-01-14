import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { LearningStatus, PracticeSessionType, WordType } from '@vocabuddy/types';

describe('User Word Practice Flow (e2e)', () => {
  let app: INestApplication;
  let accessToken: string;
  let createdWords: any[] = [];
  let practiceSession: any;

  const testUser = {
    email: 'test@example.com',
    password: 'test123',
    username: 'testuser'
  };

  const sampleWords = Array(10).fill(null).map((_, index) => ({
    word: `testword${index + 1}`,
    translations: [{ language: 'TR', text: `testkelime${index + 1}` }],
    pronunciation: 'test',
    wordType: [WordType.NOUN],
    definitions: [{
      partOfSpeech: 'noun',
      meaning: 'test meaning',
      examples: ['test example']
    }],
    examples: ['test example'],
    category: [{ name: 'General', level: 'A1' }],
    context: {
      topics: ['General'],
      situations: ['Daily Life'],
      relationships: []
    },
    etymology: {
      origin: 'test',
      period: 'Modern',
      details: []
    },
    synonymsAntonyms: {
      synonyms: [],
      antonyms: []
    },
    learning: {
      status: LearningStatus.NEW,
      nextReview: new Date(),
      reviewCount: 0,
      lastReview: null,
      strength: 0
    }
  }));

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should register a new user', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser)
      .expect(201)
      .expect(res => {
        expect(res.body.access_token).toBeDefined();
        accessToken = res.body.access_token;
      });
  });

  it('should login the user', () => {
    return request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      })
      .expect(200)
      .expect(res => {
        expect(res.body.access_token).toBeDefined();
        accessToken = res.body.access_token;
      });
  });

  it('should create 10 words', async () => {
    for (const word of sampleWords) {
      const response = await request(app.getHttpServer())
        .post('/words')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(word)
        .expect(201);

      createdWords.push(response.body);
    }
    expect(createdWords.length).toBe(10);
  });

  it('should update 5 words', async () => {
    const wordsToUpdate = createdWords.slice(0, 5);
    for (const word of wordsToUpdate) {
      await request(app.getHttpServer())
        .patch(`/words/${word.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          learning: {
            ...word.learning,
            status: LearningStatus.LEARNING,
            reviewCount: 1
          }
        })
        .expect(200);
    }
  });

  it('should delete 5 words', async () => {
    const wordsToDelete = createdWords.slice(5);
    for (const word of wordsToDelete) {
      await request(app.getHttpServer())
        .delete(`/words/${word.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);
    }
    createdWords = createdWords.slice(0, 5);
  });

  it('should create a practice session with remaining words', async () => {
    const response = await request(app.getHttpServer())
      .post('/practice/sessions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        words: createdWords.map(word => ({
          wordId: word.id,
          word: word.word,
          status: LearningStatus.LEARNING
        })),
        sessionType: PracticeSessionType.FLASHCARD,
        duration: 0,
        score: 0,
        settings: {
          reviewType: 'SPACED',
          difficulty: 'MEDIUM',
          timeLimit: 300
        },
        results: {
          completed: false,
          correctAnswers: 0,
          wrongAnswers: 0
        }
      })
      .expect(201);

    practiceSession = response.body;
    expect(practiceSession.words.length).toBe(5);
  });

  it('should record word practice statistics', async () => {
    for (const word of practiceSession.words) {
      await request(app.getHttpServer())
        .post(`/practice/sessions/${practiceSession.id}/words/${word.wordId}/practice`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          timeSpent: 30,
          metadata: {
            attemptCount: 1,
            confidence: 'HIGH',
            mistakes: []
          }
        })
        .expect(201);
    }
  });

  it('should update word status after 5 practices', async () => {
    for (const word of createdWords) {
      await request(app.getHttpServer())
        .patch(`/words/${word.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          learning: {
            status: LearningStatus.MASTERED,
            reviewCount: 6,
            strength: 1,
            lastReview: new Date(),
            nextReview: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
          }
        })
        .expect(200);
    }
  });

  afterAll(async () => {
    await app.close();
  });
}); 