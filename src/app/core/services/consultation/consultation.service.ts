// src/app/core/services/consultation/consultation.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Consultation } from '../../interfaces/consultation';

@Injectable({
  providedIn: 'root'
})
export class ConsultationService {
  private apiUrl = 'http://localhost:8080/api/consultations';


  constructor(private http: HttpClient) { }

  /**
   * Get all consultations
   */
  getConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}`);
  }

  /**
   * Get a consultation by ID
   * @param id The consultation ID
   */
  getConsultationById(id: string): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.apiUrl}/${id}`);
  }

  /**
   * Get consultations by patient ID
   * @param patientId The patient's ID
   */
  getConsultationsByPatient(patientId: string): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/patient/${patientId}`);
  }

  /**
   * Get consultations by doctor ID
   * @param doctorId The doctor's ID
   */
  getConsultationsByDoctor(doctorId: string): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.apiUrl}/doctor/${doctorId}`);
  }

  /**
   * Book a new consultation
   * @param consultation The consultation data containing:
   *  - patientId: The patient's ID
   *  - doctorId: The doctor's ID
   *  - motif: The reason for the consultation
   *  - availabilityId: The availability ID (even if dynamically generated)
   *  - dateConsultation: The date and time of the consultation
   */
  bookConsultation(consultation: any): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.apiUrl}/book`, consultation);
  }

  /**
   * Update an existing consultation
   * @param id The consultation ID
   * @param consultation The updated consultation data
   */
  updateConsultation(id: string, consultation: any): Observable<Consultation> {
    return this.http.put<Consultation>(`${this.apiUrl}/${id}`, consultation);
  }

  /**
   * Cancel a consultation
   * @param id The consultation ID
   */
  cancelConsultation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
