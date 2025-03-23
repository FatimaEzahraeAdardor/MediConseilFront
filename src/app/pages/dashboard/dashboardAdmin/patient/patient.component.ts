import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../../../core/interfaces/doctor";
import {DoctorService} from "../../../../core/services/doctor/doctor-service";
import {Patient} from "../../../../core/interfaces/user";
import {PatientService} from "../../../../core/services/patient/patient.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-patient',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './patient.component.html',
  styleUrl: './patient.component.css'
})
export class PatientComponent implements OnInit {
  patients: Patient[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  // Delete modal properties
  showDeleteModal = false;
  patientToDelete: Patient | null = null;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  loadPatients(): void {
    this.patientService.getAllPatients(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.patients = response.content;
        this.totalItems = response.totalElements;
        console.log('patients loaded:', this.patients);
        console.log('Total items:', this.totalItems);
      },
      (error) => {
        console.error('Error fetching patients:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadPatients();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    console.log('Total pages:', totalPages);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  confirmDeleterPatient(patient: Patient): void {
    this.patientToDelete = patient;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.patientToDelete = null;
  }

  deletePatient(): void {
    if (this.patientToDelete) {
      this.patientService.deletePatient(this.patientToDelete.id).subscribe({
        next: () => {
          console.log('patient deleted successfully');
          this.closeDeleteModal();
          this.loadPatients();
        },
        error: (error) => {
          console.error('Error deleting patient:', error);
          this.closeDeleteModal();
        }
      });
    }
  }
}
