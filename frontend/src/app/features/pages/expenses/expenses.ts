import { Component } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';


@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './expenses.html',
  styleUrl: './expenses.css',
})
export class Expenses {

}
