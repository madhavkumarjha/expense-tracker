import { Component, HostListener, inject } from '@angular/core';
import { Layout } from '../../../core/services/layout';
import { RouterOutlet } from '@angular/router';
import { LucideHouse, LucideWallet, LucideReceipt } from '@lucide/angular';
import { SharedModule } from '../../shared.module';
import { AuthService } from '../../../core/auth/auth-service';
import { TopNav } from '../top-nav/top-nav';

@Component({
  selector: 'app-side-nav',
  standalone: true,
  imports: [
    SharedModule,
    RouterOutlet,
    TopNav,
    LucideHouse,
    LucideWallet,
    LucideReceipt
],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.css',
})
export class SideNav {
  layout = inject(Layout);
  private authService = inject(AuthService);

  ngOnInit() {
    this.layout.updateScreenWidth(window.innerWidth);

    if (!this.authService.currentUser()) {
      this.authService.getMe().subscribe({
        error: () => undefined,
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.layout.updateScreenWidth(window.innerWidth);
  }
}
