import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/user.model';
import { catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http=inject(HttpClient);
  private router =inject(Router);
  private readonly apiUrl = `${environment.apiUrl}/auth/`;

  currentUser = signal<User | null>(null);
  isAuthenticated = signal<boolean>(false);

  login(credentials:any){
    return this.http.post<any>(`${this.apiUrl}login`, credentials).pipe(
      tap(res=>{
        this.setSession(res.accessToken, res.refreshToken);
      })
    );
  }

  refreshAccessToken(): Observable<string> {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available.'));
    }

    return this.http
      .post<{ accessToken: string }>(`${this.apiUrl}refresh`, { refreshToken })
      .pipe(
        tap((res) => {
          localStorage.setItem('accessToken', res.accessToken);
        }),
        map((res) => res.accessToken),
      );
  }
  
  getMe(){
    return this.http.get<User>(`${this.apiUrl}me`).pipe(
      tap(user=>{
        this.currentUser.set(user);
        this.isAuthenticated.set(true);
      }),
      catchError((error)=>{
        this.logout();
        return throwError(() => error);
      })
    );
  }

  setSession(accessToken: string, refreshToken?: string) {
    localStorage.setItem('accessToken', accessToken);

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  logout(){
    localStorage.clear();
    this.currentUser.set(null);
    this.isAuthenticated.set(false);
    this.router.navigate(['/login']);
  }

}
