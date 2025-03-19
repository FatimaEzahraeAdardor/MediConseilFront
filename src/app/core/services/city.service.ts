import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { City } from "../interfaces/city";

interface ApiResponse {
  message: string;
  city?: City;
}

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'http://localhost:8080/api/cities';

  constructor(private http: HttpClient) { }

  // Get all cities
  getCities(page: number, size: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }

  // Get cities by region
  getCitiesByRegion(region: string,page: number, size: number): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}?region=${region}&page=${page}&size=${size}`);
  }

  // Get a single city by ID
  getCity(id: string): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/${id}`);
  }

  // Create a new city
  createCity(city: City): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/save`, city);
  }

  // Update an existing city
  updateCity(id: string, city: City): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/update/${id}`, city);
  }

  // Delete a city
  deleteCity(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    }) as Observable<string>;
  }

  getCitiesList():Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/list`);

  }
}
