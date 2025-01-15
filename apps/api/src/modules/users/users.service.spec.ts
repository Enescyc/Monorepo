import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { PremiumPlan } from '@vocabuddy/types';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: Partial<User> = {
    id: '1',
    email: 'test@example.com',
    username: 'testuser',
    name: 'Test User',
    password: 'hashedPassword',
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        username: 'testuser',
        name: 'Test User',
        password: 'password123',
        languages: [],
        premium: {
          isActive: false,
          plan: PremiumPlan.FREE,
          expiresAt: null,
          features: [],
        },
        settings: {} as any,
        progress: {} as any,
        isEmailVerified: false,
        metadata: {
          lastActive: new Date(),
          deviceInfo: {
            platform: '',
            version: '',
            devices: [],
          },
        },
        achievements: [],
      };

      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [mockUser];
      mockRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('should return null if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update and return the user if found', async () => {
      const updateUserDto: UpdateUserDto = {
        name: 'Updated Name',
      };
      const updatedUser = { ...mockUser, ...updateUserDto };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update('1', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove the user if found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
}); 