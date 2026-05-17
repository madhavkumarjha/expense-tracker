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

  createExpense(expense: Expense) {
    return this.http.post<{ success: boolean; expense: Expense }>(`${this.apiUrl}/create`, expense);
  }

  updateExpense(expense: Expense) {
    return this.http.put<{ success: boolean; expense: Expense }>(`${this.apiUrl}/update/${expense._id}`, expense);
  }

  deleteExpense(id: string) {
    return this.http.delete<{ success: boolean }>(`${this.apiUrl}/delete/${id}`);
  }
}
