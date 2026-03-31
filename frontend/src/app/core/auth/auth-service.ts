import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { catchError, tap } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http=inject(HttpClient);
  private router =inject(Router);
  private readonly apiUrl = 'http://localhost:9000/api/auth/';

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  login(credentials:any){
    return this.http.post<any>(`${this.apiUrl}login`, credentials).pipe(
      tap(res=>{
        localStorage.setItem('accessToken', res.accessToken);
        localStorage.setItem('refreshToken', res.refreshToken);
      // })
      })
    );
  }
  
  getMe(){
    return this.http.get<User>(`${this.apiUrl}me`).pipe(
      tap(user=>{
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
      catchError(()=>{
        this.logout();
        throw new Error('Session expired. Please log in again.');
      })
    );
  }

  logout(){
    localStorage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

}
