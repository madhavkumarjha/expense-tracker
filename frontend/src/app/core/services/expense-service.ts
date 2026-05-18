import { Injectable } from '@angular/core';
import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/expenses`;

  getExpenses() {
    return this.http.get<{ success: boolean; expenses: Expense[] }>(`${this.apiUrl}/all`);
  }

  deleteMultipleExpenses(idsToDelete: string[]) {
    return this.http.request<{ success: boolean }>('delete', `${this.apiUrl}/multi`, {
      body: { idsToDelete },
    });
  }
  
  getMonthlyExpenses(month?: number, year?: number) {
    let url = `${this.apiUrl}/`;
    const query: string[] = [];

    if (month !== undefined) {
      query.push(`month=${month}`);
    }
    if (year !== undefined) {
      query.push(`year=${year}`);
    }
    if (query.length > 0) {
      url += `?${query.join('&')}`;
    }

    return this.http.get<{ success: boolean; expenses: Expense[] }>(url);
  }

  createExpense(expense: Expense) {
    return this.http.post<{ success: boolean; message: string; expense: Expense }>(
      `${this.apiUrl}/`,
      expense,
    );
  }

  updateExpense(expense: Expense) {
    return this.http.patch<{ success: boolean; message: string }>(
      `${this.apiUrl}/${expense._id}`,
      expense,
    );
  }

  deleteExpense(eid: string) {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${eid}`);
  }
}
