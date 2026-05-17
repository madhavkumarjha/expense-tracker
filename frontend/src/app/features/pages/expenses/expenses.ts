import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';
import { ExpenseForm } from './components/expense-form/expense-form';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [SharedModule, ExpenseForm],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {
  showForm = false;

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
