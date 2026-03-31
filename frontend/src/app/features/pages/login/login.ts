import { Component, inject } from '@angular/core';
import { SharedModule } from '../../../shared/shared.module';

import { ReactiveFormsModule,FormBuilder,Validators } from '@angular/forms';
import { AuthService } from '../../../core/auth/auth-service';
import { toast } from 'ngx-sonner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [SharedModule,ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = new FormBuilder();
  private authService = inject(AuthService);
  // private toast = inject(toast);
  private router = inject(Router);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(5)]],
  });

  onSubmit() {
    if (this.loginForm.valid) {
      const credentials = this.loginForm.getRawValue();
      this.authService.login(credentials).subscribe({
        next: (res) => {
          toast.success('Login successful!');
          this.router.navigate(['/expense-tracker/dashboard']);
        },
        error: (err:any) => {
          toast.error('Login failed. Please check your credentials and try again.');
          console.error('Login error:', err);
        },
      });
    }
  }
}
