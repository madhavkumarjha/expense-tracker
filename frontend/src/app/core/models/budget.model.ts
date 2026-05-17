export interface Budget {
  _id?: string;
  limit: number;
  month: number;
  year: number;
  period: 'monthly' | 'weekly';
  alertFrequency: 'daily' | 'weekly' | 'monthly';
}