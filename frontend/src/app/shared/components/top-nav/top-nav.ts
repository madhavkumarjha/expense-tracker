import { Component, computed, inject } from '@angular/core';
import { SharedModule } from '../../shared.module';
import { AuthService } from '../../../core/auth/auth-service';
import { LucideLogOut, LucideMenu } from '@lucide/angular';
import { Layout } from '../../../core/services/layout';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [SharedModule, LucideMenu, LucideLogOut],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.css',
})
export class TopNav {
  readonly authService = inject(AuthService);
  readonly layout = inject(Layout);

  readonly user = computed(() => this.authService.currentUser());
  readonly initials = computed(() => {
    const name = this.user()?.name?.trim();

    if (!name) {
      return 'U';
    }

    return name
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('');
  });

  toggleSidebar() {
    this.layout.toggleSidebar();
  }

  logout() {
    this.authService.logout();
  }
}
