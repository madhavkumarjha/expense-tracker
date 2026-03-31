import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dash-card.html',
  styleUrl: './dash-card.css',
})
export class DashCard {
  @Input() label: string = '';
  @Input() value: number = 0;
  @Input() type: 'budget' | 'expense' | 'remaining' = 'budget';

  // 💡 Move styling logic here to keep HTML clean
  config = {
    budget:    { border: 'border-blue-500',  bg: 'bg-blue-500',  text: 'text-blue-700' },
    expense:   { border: 'border-red-500',   bg: 'bg-red-500',   text: 'text-red-700' },
    remaining: { border: 'border-green-500', bg: 'bg-green-500', text: 'text-green-700' }
  };
}
