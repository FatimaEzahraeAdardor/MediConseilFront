import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../doctor/doctor-service";
import {City} from "../../interfaces/city";
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

}
