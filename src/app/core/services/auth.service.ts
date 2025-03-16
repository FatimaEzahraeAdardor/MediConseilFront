import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiResponse, User} from "../interfaces/user";
import {Observable} from "rxjs";

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
}
