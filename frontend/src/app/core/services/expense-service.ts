import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export interface Expense {
  _id?: string;
  amount: number;
  title: string;
  date: string; // ISO format
  category: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/expenses`;

  getExpenses() {
    return this.http.get<{ success: boolean; expenses: Expense[] }>(`${this.apiUrl}/all`);
  }

  
}
