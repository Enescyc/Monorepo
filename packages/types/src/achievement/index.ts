export interface Achievement {
  id: string;
  name: string;
  description: string;
  points: number;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}

export const achievements: Achievement[] = [
  {
    id: '1',
    name: 'Beginner',
    description: 'You have studied 10 words in the last 7 days.',
    points: 10,
    icon: '🎓',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '2',
    name: 'Intermediate',
    description: 'You have studied 100 words in the last 7 days.',
    points: 100,
    icon: '🎓',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: '3',
    name: 'Advanced',
    description: 'You have studied 1000 words in the last 7 days.',
    points: 1000,
    icon: '🎓',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]; 