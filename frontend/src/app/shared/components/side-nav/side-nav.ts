import { Component, inject } from '@angular/core';
import { Layout } from '../../../core/services/layout';
import { RouterOutlet } from '@angular/router';
import { LucideHouse, LucideLayoutDashboard, LucideLogOut, LucideWallet, LucideReceipt } from '@lucide/angular';
import { SharedModule } from '../../shared.module';
import { AuthService } from '../../../core/auth/auth-service';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    SharedModule,
    RouterOutlet,
    LucideLayoutDashboard,
    LucideHouse,
    LucideLogOut,
    LucideWallet,
    LucideReceipt
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
