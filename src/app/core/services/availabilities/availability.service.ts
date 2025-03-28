// src/app/core/services/availabilities/availability.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Availability } from '../../interfaces/availability';

@Injectable({
  providedIn: 'root'
})
export class AvailabilityService {
  private apiUrl = 'http://localhost:8080/api/availabilities';


  constructor(private http: HttpClient) { }

  /**
   * Get all availabilities
   */
  getAvailabilities(): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}`);
  }

  /**
   * Get availabilities by doctor
   * @param doctorId The doctor's ID
   */
  getAvailabilitiesByDoctor(doctorId: string): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  /**
   * Get availabilities by doctor and date
   * @param doctorId The doctor's ID
   * @param date The date in YYYY-MM-DD format
   */
  getAvailabilitiesByDoctorAndDate(doctorId: string, date: string): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/doctor/${doctorId}/date/${date}`);
  }

  /**
   * Get or generate availabilities for a doctor on a specific date
   * @param doctorId The doctor's ID
   * @param date The date in YYYY-MM-DD format
   */
  getGeneratedAvailabilities(doctorId: string, date: string): Observable<Availability[]> {
    return this.http.get<Availability[]>(`${this.apiUrl}/doctor/${doctorId}/generate/${date}`);
  }

  /**
   * Create a new availability
   * @param availability The availability data
   */
  createAvailability(availability: any): Observable<Availability> {
    return this.http.post<Availability>(`${this.apiUrl}`, availability);
  }

  /**
   * Update an existing availability
   * @param id The availability ID
   * @param availability The updated availability data
   */
  updateAvailability(id: string, availability: any): Observable<Availability> {
    return this.http.put<Availability>(`${this.apiUrl}/${id}`, availability);
  }

  /**
   * Delete an availability
   * @param id The availability ID
   */
  deleteAvailability(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
