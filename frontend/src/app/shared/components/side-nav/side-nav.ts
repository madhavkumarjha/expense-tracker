import { Component, inject } from '@angular/core';
import { Layout } from '../../../core/services/layout';
import { RouterOutlet } from '@angular/router';
import {
  LucideChevronLeft,
  LucideChevronRight,
  LucideHouse,
  LucideLayoutDashboard,
  LucideLogOut,
} from '@lucide/angular';
import { SharedModule } from '../../shared.module';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-side-nav',
  imports: [
    SharedModule,
    RouterOutlet,
    LucideLayoutDashboard,
    LucideChevronLeft,
    LucideChevronRight,
    LucideHouse,
    LucideLogOut,
  ],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  layout = inject(Layout);
  private authService = inject(AuthService);

  toggleSidebar() {
    this.layout.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }
}
