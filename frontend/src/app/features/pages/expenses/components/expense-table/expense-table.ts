import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../../../../../shared/shared.module';
import { Expense as ExpenseModel } from '../../../../../core/models/expense.model';

@Component({
  selector: 'app-expense-table',
  standalone:true,
  imports: [SharedModule],
  templateUrl: './expense-table.html',
  styleUrl: './expense-table.css',
})
export class ExpenseTable {
  @Input() expenses: ExpenseModel[] = [];
  @Output() editExpense = new EventEmitter<ExpenseModel>();
  @Output() deleteExpense = new EventEmitter<ExpenseModel>();

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: '2-digit' });
  }

}
