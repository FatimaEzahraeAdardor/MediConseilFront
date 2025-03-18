import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import { ApiResponse, User } from "../interfaces/user";
import {Observable, map, tap, of, catchError} from "rxjs";
import { Router } from '@angular/router';
import {jwtDecode} from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(
    private _http: HttpClient,
    private router: Router
  ) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserId(): string | null {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken: any = jwtDecode(token);
      if (decodedToken.id) {
        return decodedToken.id;
      }
    }
    return null;
  }

  getUserById(): Observable<User | null> {
    const token = localStorage.getItem('token');
    if (!token) {
      return of(null); // Return an observable of null if no token is found
    }

    try {
      const decodedToken: any = jwtDecode(token);
      const userId = decodedToken.id;

      if (!userId) {
        return of(null);
      }

      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this._http.get<User>(`http://localhost:8080/api/users/${userId}`, { headers }).pipe(
        catchError(error => {
          console.error('Error fetching user data:', error);
          return of(null);
        })
      );
    } catch (error) {
      console.error('Error decoding token:', error);
      return of(null);
    }
  }

  register(payload: User): Observable<ApiResponse<User>> {
    return this._http.post<ApiResponse<User>>(`${this.apiUrl}/register`, payload);
  }

  login(email: string, password: string): Observable<any> {
    const loginPayload = { email, password };

    return this._http.post<any>(`${this.apiUrl}/login`, loginPayload)
      .pipe(
        tap(response => {
          if (response) {
            const token = response.token ||
              (response.data && response.data.token)
            localStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token));
            console.log('Token saved to localStorage');
          }
        })
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/']);
  }

}
