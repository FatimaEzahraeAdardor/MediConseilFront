import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../doctor/doctor-service";
import {Patient, User} from "../../interfaces/user";

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) { }
  getAllPatients(page: number, size: number): Observable<Page<Patient>> {
    return this.http.get<Page<Patient>>(`${this.apiUrl}/patients?page=${page}&size=${size}`);
  }
  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }
  createPatient(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/save`, user);
  }

  deletePatient(id: string ): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    }) as Observable<string>;
  }
}
