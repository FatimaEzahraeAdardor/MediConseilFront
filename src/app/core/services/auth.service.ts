import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { ApiResponse, User } from "../interfaces/user";
import { Observable, map, tap } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private _http: HttpClient) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
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
            const token = response.token || response.data?.token;
            localStorage.setItem('token', typeof token === 'string' ? token : JSON.stringify(token));
            console.log('Token saved:', token);
          }
        })
      );
  }

}
