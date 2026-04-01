import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

export interface Budget {
  _id?: string;
  limit: number;
  month: number;
  year: number;
  period: 'monthly' | 'weekly';
  alertFrequency: 'daily' | 'weekly' | 'monthly';
}

@Injectable({
  providedIn: 'root',
})

export class BudgetService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/budgets`;

  currentBudget = signal<Budget | null>(null);

  getBudgets(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/all`);
  }

  getBudget(month: number, year: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get?month=${month}&year=${year}`).pipe(
      tap((res) => {
        if (res.success) this.currentBudget.set(res.budget);
      }),
    );
  }

  createBudget(budget: Budget): Observable<any> {
    return this.http.post<any>(this.apiUrl, budget).pipe(
      tap((res) => {
        if (res.success) this.currentBudget.set(res.budget);
      }),
    );
  }

  updateBudget(budget: Budget): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${budget._id}`, budget).pipe(
      tap((res) => {
        if (res.success) this.currentBudget.set(res.budget);
      }),
    );
  }

  deleteBudget(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
      tap((res) => {
        if (res.success) this.currentBudget.set(null);
      }),
    );
  }
}
