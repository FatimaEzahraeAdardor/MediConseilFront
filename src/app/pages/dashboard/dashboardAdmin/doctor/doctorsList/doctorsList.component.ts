import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DoctorService } from "../../../../../core/services/doctor/doctor-service";
import { Doctor } from "../../../../../core/interfaces/doctor";

@Component({
  selector: 'app-doctorsList',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './doctorsList.component.html',
  styleUrl: './doctorsList.component.css'
})
export class DoctorsListComponent implements OnInit {
  doctors: Doctor[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  // Delete modal properties
  showDeleteModal = false;
  doctorToDelete: Doctor | null = null;

  constructor(private doctorService: DoctorService) {}

  ngOnInit(): void {
    this.loadDoctors();
  }

  loadDoctors(): void {
    this.doctorService.getAllDoctors(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.doctors = response.content;
        this.totalItems = response.totalElements;
        console.log('Doctors loaded:', this.doctors);
        console.log('Total items:', this.totalItems);
      },
      (error) => {
        console.error('Error fetching doctorsList:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctors();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    console.log('Total pages:', totalPages);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  confirmDeleteDoctor(doctor: Doctor): void {
    this.doctorToDelete = doctor;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.doctorToDelete = null;
  }

  deleteDoctor(): void {
    if (this.doctorToDelete) {
      this.doctorService.deleteDoctor(this.doctorToDelete.id).subscribe({
        next: () => {
          console.log('Doctor deleted successfully');
          this.closeDeleteModal();
          this.loadDoctors();
        },
        error: (error) => {
          console.error('Error deleting doctor:', error);
          this.closeDeleteModal();
        }
      });
    }
  }
}
