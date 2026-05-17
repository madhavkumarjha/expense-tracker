import { Component, EventEmitter, Output } from '@angular/core';
import { LucideX } from '@lucide/angular';
import { SharedModule } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-expense-form',
  imports: [LucideX, SharedModule],
  templateUrl: './expense-form.html',
  styleUrl: './expense-form.css',
})
export class ExpenseForm {
  @Output() close = new EventEmitter<void>();

  closeForm() {
    this.close.emit();
  }
}
