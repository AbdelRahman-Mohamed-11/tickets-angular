import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { LoginRequest, LoginResponse } from '../interfaces/auth.interface';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = 'https://localhost:7269/api';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  private tokenKey = 'token';
  private refreshTokenKey = 'refreshToken';

  constructor(private http: HttpClient) {
    this.checkInitialAuth();
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/auth/users/current`);
  }
  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/auth/users`);
  }

  getERPUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.API_URL}/auth/erp-users`);
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/login`, credentials)
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }
  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http
      .post<LoginResponse>(`${this.API_URL}/auth/refresh-token`, {
        refreshToken,
      })
      .pipe(
        tap((response) => {
          this.setToken(response.token);
          this.setRefreshToken(response.refreshToken);
          this.isAuthenticatedSubject.next(true);
        })
      );
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.refreshTokenKey);
  }

  private setRefreshToken(token: string): void {
    localStorage.setItem(this.refreshTokenKey, token);
  }

  private removeRefreshToken(): void {
    localStorage.removeItem(this.refreshTokenKey);
  }
  logout(): void {
    this.removeToken();
    this.isAuthenticatedSubject.next(false);
  }

  private checkInitialAuth(): void {
    const token = this.getToken();
    this.isAuthenticatedSubject.next(!!token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
