import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { Budget as BudgetModel } from '../../../../../core/services/budget-service';

@Component({
  selector: 'app-budget-table',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './budget-table.html',
  styleUrl: './budget-table.css',
})
export class BudgetTableComponent {
  @Input() budgets: BudgetModel[] = [];
  @Output() editBudget = new EventEmitter<BudgetModel>();
  @Output() deleteBudget = new EventEmitter<BudgetModel>();

  readonly monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
}
