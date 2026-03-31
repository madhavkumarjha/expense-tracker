import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dash-table',
  standalone: true,
  imports: [],
  templateUrl: './dash-table.html',
  styleUrl: './dash-table.css',
})
export class DashTable {
  @Input() transactions: Array<{
    title: string;
    category: string;
    amount: number;
    date: string;
  }> = [];
}
