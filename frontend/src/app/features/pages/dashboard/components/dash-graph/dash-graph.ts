import { Component, Input } from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-dash-graph',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './dash-graph.html',
  styleUrl: './dash-graph.css',
})
export class DashGraph {
  @Input() series: any[] = [];
  @Input() categories: string[] = [];
  @Input() type: 'line' | 'area' | 'bar' = 'area';
  @Input() height: number = 300;
  @Input() colors: string[] = ['#6366f1'];
}
