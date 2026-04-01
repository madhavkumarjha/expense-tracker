import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { LucideReceipt, LucideUserRoundPen, LucideWallet } from '@lucide/angular';

@Component({
  selector: 'app-dash-card',
  standalone: true,
  imports: [CommonModule, LucideWallet, LucideReceipt, LucideUserRoundPen],
  templateUrl: './dash-card.html',
  styleUrl: './dash-card.css',
})
export class DashCard {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() type: 'budget' | 'expense' | 'remaining' = 'budget';

  config = {
    budget: { border: 'border-blue-500', bg: 'bg-blue-500', text: 'text-blue-700' },
    expense: { border: 'border-red-500', bg: 'bg-red-500', text: 'text-red-700' },
    remaining: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-700' },
  };
}
