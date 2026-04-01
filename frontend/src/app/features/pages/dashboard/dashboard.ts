import { Component, inject } from '@angular/core';
import { AuthService } from '../../../core/auth/auth-service';
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
export class Dashboard {
  private authService = inject(AuthService);
  totalBudget = 4500;
  totalExpenses = 3200;
  remainingBudget = this.totalBudget - this.totalExpenses;

// graph
  chartData = [{ name: 'Daily Spend', data: [1200, 3000, 1500, 900, 2100] }];
  chartLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  
// tables
  transactions = [
    { title: 'Grocery', category: 'food', amount: 1200, date: '2026-03-28' },
    { title: 'Petrol', category: 'transport', amount: 3000, date: '2026-03-29' },
  ];
}
