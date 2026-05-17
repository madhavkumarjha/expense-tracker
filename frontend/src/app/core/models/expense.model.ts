export interface Expense {
  _id?: string;
  amount: number;
  title: string;
  date: string; // ISO format
  category: string;
  notes?: string;
}