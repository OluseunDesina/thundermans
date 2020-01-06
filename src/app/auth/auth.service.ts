import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Auth } from './auth-model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private token: string;
  private userId: string;
  private isAuthListener = new Subject<boolean>();
  private isLoadingListener = new Subject<boolean>();
  private tokenTimer: any;
  isAuth: boolean;

  constructor(private http: HttpClient, private router: Router) {}

  register(form: NgForm) {
    const authData: Auth = form.value;
    this.http.post(`${this.apiUrl}/auth/signup`, authData).subscribe(
      response => {
        console.log(response);
        this.isAuthListener.next(true);
        this.router.navigate(['/streams']);
        // this.login(form);
        form.resetForm();
      },
      error => {
        this.isLoadingListener.next(false);
      }
    );
  }

  login(form: NgForm) {
    const authData: Auth = form.value;
    this.http
      .post<{
        token: string;
        expiresIn: number;
        message: string;
        user_id: string;
        username: string;
      }>(`${this.apiUrl}/auth/login`, authData)
      .subscribe(
        response => {
          console.log(response);
          const token = response.token;
          const userId = response.user_id;
          const username = response.username;
          const expiresIn = response.expiresIn;
          this.token = token;
          this.userId = userId;
          if (token) {
            this.isAuth = true;
            this.isAuthListener.next(this.isAuth);
            this.timedLogout(expiresIn);
          }
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresIn * 1000);
          this.saveAuthData(token, expirationDate, userId, username);
          form.resetForm();
          this.router.navigate(['/streams']);
        },
        error => {
          this.isLoadingListener.next(false);
        }
      );
  }

  logOut() {
    this.token = null;
    this.isAuth = false;
    this.userId = null;
    this.isAuthListener.next(this.isAuth);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(['/']);
  }

  private timedLogout(expiresIn) {
    this.tokenTimer = setTimeout(() => {
      this.logOut();
    }, expiresIn * 1000);
  }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    return this.isAuth;
  }

  getIsAuthListener() {
    return this.isAuthListener.asObservable();
  }

  getIsLoadingListener() {
    return this.isLoadingListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string, username: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('username', username);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  autoAuthUser() {
    const authData = this.getAuthData();
    if (!authData) {
      return;
    }
    const now = new Date();
    const expirationDate = new Date(authData.expirationDate);
    const expiresIn = expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authData.token;
      this.userId = authData.userId;
      this.isAuth = true;
      this.isAuthListener.next(this.isAuth);
      this.timedLogout(expiresIn / 1000);
    }
  }

  private getAuthData() {
    return {
      token: localStorage.getItem('token'),
      expirationDate: localStorage.getItem('expiration'),
      userId: localStorage.getItem('userId')
    };
  }
}
