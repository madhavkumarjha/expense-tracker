import { Component, inject, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { delay, filter, Subject, takeUntil } from 'rxjs';
import { BudgetService } from '../../../core/services/budget-service';
import { ExpenseService } from '../../../core/services/expense-service';
import { DashCard } from './components/dash-card/dash-card';
import { DashGraph } from './components/dash-graph/dash-graph';
import { DashTable } from './components/dash-table/dash-table';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [DashCard, DashGraph, DashTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private destroy$ = new Subject<void>();
  private budgetService = inject(BudgetService);
  private expenseService = inject(ExpenseService);

  totalBudget = 0;
  totalExpenses = 0;
  remainingBudget = 0;
  monthLabel = '';
  chartData = [{ name: 'Daily Spend', data: [] as number[] }];
  chartLabels: string[] = [];
  transactions: Array<{ title: string; category: string; amount: number; date: string }> = [];

  ngOnInit() {
    this.loadDashboard();
  }

  ngAfterViewInit() {
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        filter((event) => event.urlAfterRedirects.includes('/dashboard')),
        delay(0),
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.loadDashboard());
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadDashboard() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    this.monthLabel = now.toLocaleString('default', { month: 'long', year: 'numeric' });

    this.budgetService.getBudget().subscribe({
      next: (res) => {
        this.totalBudget = res.budget?.limit ?? 0;
        this.updateRemainingBudget();
      },
      error: () => {
        this.totalBudget = 0;
        this.updateRemainingBudget();
      },
    });

    this.expenseService.getMonthlyExpenses(month, year).subscribe({
      next: (res) => {
        const expenses = res.expenses ?? [];
        this.totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount ?? 0), 0);
        this.transactions = this.buildRecentTransactions(expenses);
        const dailyData = this.buildDailyTotals(expenses);
        this.chartLabels = dailyData.labels;
        this.chartData = [{ name: 'Daily Spend', data: dailyData.values }];
        this.updateRemainingBudget();
      },
      error: () => {
        this.totalExpenses = 0;
        this.transactions = [];
        this.chartLabels = [];
        this.chartData = [{ name: 'Daily Spend', data: [] }];
        this.updateRemainingBudget();
      },
    });
  }

  private updateRemainingBudget() {
    this.remainingBudget = Math.max(0, this.totalBudget - this.totalExpenses);
  }

  private buildRecentTransactions(expenses: any[]) {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6)
      .map((expense) => ({
        title: expense.title ?? 'Untitled',
        category: expense.category ?? 'other',
        amount: Number(expense.amount ?? 0),
        date: this.formatDate(expense.date),
      }));
  }

  private buildDailyTotals(expenses: any[]) {
    const totals = new Map<string, number>();

    expenses.forEach((expense) => {
      const date = new Date(expense.date).toISOString().slice(0, 10);
      totals.set(date, (totals.get(date) ?? 0) + Number(expense.amount ?? 0));
    });

    const sortedDates = Array.from(totals.keys()).sort();
    return {
      labels: sortedDates.map((date) => this.formatDate(date)),
      values: sortedDates.map((date) => totals.get(date) ?? 0),
    };
  }

  private formatDate(value: string) {
    return new Date(value).toLocaleDateString('default', {
      month: 'short',
      day: 'numeric',
    });
  }
}
