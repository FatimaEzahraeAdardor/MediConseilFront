import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Doctor, DoctorRequest} from "../../interfaces/doctor";
import {Observable} from "rxjs";

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8080/api/doctors';

  constructor(private http: HttpClient) { }
  getAllDoctors(page: number, size: number): Observable<Page<Doctor>> {
    return this.http.get<Page<Doctor>>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }
  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
  // Create a new doctor
  createDoctor(doctor: DoctorRequest): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/save`, doctor);
  }
  deleteDoctor(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    }) as Observable<string>;
  }
  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

}
