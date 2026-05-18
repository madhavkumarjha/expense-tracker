import { Component, EventEmitter, Input, output, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LucideX } from '@lucide/angular';
import { SharedModule } from '../../../../../shared/shared.module';
import { Expense as ExpenseModel } from '../../../../../core/models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [LucideX, SharedModule, FormsModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  @Output() close = new EventEmitter<void>();
  @Input({ required: true }) expense!: ExpenseModel;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() save = new EventEmitter<ExpenseModel>();
  @Output() cancel = new EventEmitter<void>();

  readonly categoryOptions = ["food", "transport", "shopping", "utilities", "other"];

  form: ExpenseModel = this.createEmptyExpense();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['expense']?.currentValue) {
      this.form = {
        ...changes['expense'].currentValue,
      };
    }
  }

  submit() {
    this.save.emit({
      ...this.form,
      amount: Number(this.form.amount),
    });
  }

  isInvalid() {
    return (
      !this.form.title ||
      !this.form.title.trim() ||
      !this.form.amount ||
      this.form.amount <= 0 ||
      !this.form.date ||
      !this.form.category
    );
  }

  cancelForm() {
    this.cancel.emit();
  }

  private createEmptyExpense(): ExpenseModel {
    return {
      title: '',
      amount: 0,
      category: 'food',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    };
  }
}
