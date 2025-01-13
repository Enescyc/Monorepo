export interface Premium {
  id: string;
  name: string;
  price: number;
  currency: string;
  duration: number;
  purchaseDate: Date;
  expirationDate: Date;
  status: PremiumStatus;
}

export enum PremiumStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive'
} 