export interface Language {
  name: string;
  code: string;
  native: boolean;
  proficiency: ProficiencyLevel;
  startedAt: Date;
  lastStudied: Date;
}

export enum ProficiencyLevel {
  A1 = 'A1',
  A2 = 'A2',
  B1 = 'B1',
  B2 = 'B2',
  C1 = 'C1',
  C2 = 'C2'
} 