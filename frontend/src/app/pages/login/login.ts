import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  login() {
    this.http
      .post('https://dummyjson.com/user/login', {
        username: this.username,
        password: this.password,
        expiresInMins: 30,
      })
      .subscribe({
        next: (res) => {
          console.log('login success', res);
          alert('login success');
        },
        error: (err) => {
          console.log('Login error:', err);
          alert('Login failed');
        },
      });
  }
}
