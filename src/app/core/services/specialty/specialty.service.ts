import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../doctor/doctor-service";
import {Specialty} from "../../interfaces/specialty";

@Injectable({
  providedIn: 'root'
})
export class SpecialtyService {
  private apiUrl = 'http://localhost:8080/api/specialities';

  constructor(private http: HttpClient) { }

  // Get all specialities
  getAllSpecialties(): Observable<Specialty[]> {
    return this.http.get<Specialty[]>(`${this.apiUrl}/all`);
  }
  getSpecialties(page: number, size: number): Observable<Page<Specialty>> {
    return this.http.get<Page<Specialty>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }
  // Get a single city by ID
  getSpecialty(id: string): Observable<Specialty> {
    return this.http.get<Specialty>(`${this.apiUrl}/${id}`);
  }

  createSpecialty(specialty: Specialty): Observable<Specialty> {
    return this.http.post<Specialty>(`${this.apiUrl}/save`, specialty);
  }

  updateCSpecialty(id: string, specialty: Specialty): Observable<Specialty> {
    return this.http.put<Specialty>(`${this.apiUrl}/update/${id}`, specialty);
  }

  deleteSpecialty(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    }) as Observable<string>;
  }


}
