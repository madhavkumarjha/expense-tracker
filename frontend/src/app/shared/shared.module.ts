import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // Usually good to include this too!
import { RouterLink, RouterLinkActive } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterLink, RouterLinkActive],
  exports: [CommonModule, RouterLink, RouterLinkActive] 
})
export class SharedModule {}