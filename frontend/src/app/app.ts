import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster, ToastOptions } from 'ngx-sonner';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxSonnerToaster],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
  protected readonly toastOptions: ToastOptions = {
    unstyled: true,
    classes: {
      toast:
        'rounded-xl border bg-white shadow-lg px-4 py-3 flex items-start gap-3',
      title: 'text-sm font-semibold text-current',
      description: 'text-xs text-current opacity-80',
      success: 'border-green-200 bg-green-50 text-green-700',
      error: 'border-red-200 bg-red-50 text-red-700',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-800',
      info: 'border-blue-200 bg-blue-50 text-blue-700',
    },
  };
}
