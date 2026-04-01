import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../../../shared/shared.module';
import { Budget as BudgetModel } from '../../../../../core/services/budget-service';

@Component({
  selector: 'app-budget-form',
  standalone: true,
  imports: [SharedModule, FormsModule],
  templateUrl: './budget-form.html',
  styleUrl: './budget-form.css',
})
export class BudgetFormComponent {
  @Input({ required: true }) budget!: BudgetModel;
  @Input() mode: 'create' | 'edit' = 'create';
  @Output() save = new EventEmitter<BudgetModel>();
  @Output() cancel = new EventEmitter<void>();

  readonly alertOptions: BudgetModel['alertFrequency'][] = ['daily', 'weekly', 'monthly'];
  readonly monthOptions = [
    { value: 0, label: 'January' },
    { value: 1, label: 'February' },
    { value: 2, label: 'March' },
    { value: 3, label: 'April' },
    { value: 4, label: 'May' },
    { value: 5, label: 'June' },
    { value: 6, label: 'July' },
    { value: 7, label: 'August' },
    { value: 8, label: 'September' },
    { value: 9, label: 'October' },
    { value: 10, label: 'November' },
    { value: 11, label: 'December' },
  ];

  form: BudgetModel = this.createEmptyBudget();

  ngOnChanges(changes: SimpleChanges) {
    if (changes['budget']?.currentValue) {
      this.form = {
        ...changes['budget'].currentValue,
      };
    }
  }

  setAlertFrequency(option: BudgetModel['alertFrequency']) {
    this.form.alertFrequency = option;
  }

  submit() {
    this.save.emit({
      ...this.form,
      limit: Number(this.form.limit),
      month: Number(this.form.month),
      year: Number(this.form.year),
    });
  }

  isInvalid() {
    return !this.form.limit || this.form.limit <= 0 || !this.form.period || !this.form.alertFrequency || this.form.year < 2000;
  }

  private createEmptyBudget(): BudgetModel {
    const now = new Date();

    return {
      limit: 0,
      month: now.getMonth(),
      year: now.getFullYear(),
      period: 'monthly',
      alertFrequency: 'weekly',
    };
  }
}
