import { Injectable, signal, computed, HostListener } from '@angular/core';

// ng generate service core/services/layout to create layout service for managing layout state and behavior

@Injectable({
  providedIn: 'root',
})
export class Layout {
  private _isSidebarExpanded = signal(true);

  private _screenWidth = signal(window.innerWidth);

  isSidebarOpen = this._isSidebarExpanded.asReadonly();

  isMobileView = computed(() => this._screenWidth() < 768);

  toggleSidebar() {
    this._isSidebarExpanded.update((value) => !value);
  }

  closeSidebar() {
    this._isSidebarExpanded.set(false);
  }

  updateScreenWidth(width: number) {
    this._screenWidth.set(width);
    width < 768 ? this.closeSidebar() : this._isSidebarExpanded.set(true);
  }
}
