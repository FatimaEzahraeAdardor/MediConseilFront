import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { City } from "../interfaces/city";
import {Page} from "./doctor-service";
import {Category} from "../interfaces/category";



@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'http://localhost:8080/api/cities';

  constructor(private http: HttpClient) { }

  // Get all cities
  getCities(page: number, size: number): Observable<Page<City>> {
    return this.http.get<Page<City>>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }

  // Récupérer les villes par région avec pagination
  getCitiesByRegion(region: string, page: number, size: number): Observable<Page<City>> {
    return this.http.get<Page<City>>(`${this.apiUrl}/region/${region}?page=${page}&size=${size}`);
  }

  // Get a single city by ID
  getCity(id: string): Observable<City> {
    return this.http.get<City>(`${this.apiUrl}/${id}`);
  }

  // Create a new city
  createCity(city: City): Observable<City> {
    return this.http.post<City>(`${this.apiUrl}/save`, city);
  }

  // Update an existing city
  updateCity(id: string, city: City): Observable<City> {
    return this.http.put<City>(`${this.apiUrl}/update/${id}`, city);
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
  getRegions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/regions`);
  }
}
