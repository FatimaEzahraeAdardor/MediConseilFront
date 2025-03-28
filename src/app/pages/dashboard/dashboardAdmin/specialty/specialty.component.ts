import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {Specialty} from "../../../../core/interfaces/specialty";
import {SpecialtyService} from "../../../../core/services/specialty/specialty.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-specialty',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './specialty.component.html',
  styleUrl: './specialty.component.css'
})
export class SpecialtyComponent implements OnInit {
  specialties: Specialty[] = [];
  currentPage = 0;
  pageSize = 1;
  totalItems = 0;

  specialtyForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentspecialtyId: string | null = null;

  // Delete modal properties
  showDeleteModal = false;
  specialtyToDelete: Specialty | null = null;

  constructor(
    private specialtyService: SpecialtyService,
    private fb: FormBuilder
  ) {
    this.specialtyForm = this.fb.group({
      name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadSpecialties();
  }

  loadSpecialties(): void {
    this.specialtyService.getSpecialties(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.specialties = response.content;
        this.totalItems = response.totalElements;
      },
      (error) => {
        console.error('Error fetching specialties:', error);
      }
    );
  }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSpecialties();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }
  // Modal management
  openAddSpecialtyModal(): void {
    this.isEditing = false;
    this.currentspecialtyId = null;
    this.specialtyForm.reset();
    this.showModal = true;
  }

  editSpecialty(specialty: Specialty): void {
    this.isEditing = true;
    this.currentspecialtyId = specialty.id;
    this.specialtyForm.setValue({
      name: specialty.name,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.specialtyForm.reset();
  }

  saveSpecialty(): void {
    if (this.specialtyForm.valid) {
      const specialtyData: Specialty = {
        id: this.currentspecialtyId || '',
        name: this.specialtyForm.value.name,
      };

      if (this.isEditing && this.currentspecialtyId) {
        this.specialtyService.updateCSpecialty(this.currentspecialtyId, specialtyData).subscribe(
          () => {
            this.closeModal();
            this.loadSpecialties();
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      } else {
        this.specialtyService.createSpecialty(specialtyData).subscribe(
          () => {
            this.closeModal();
            this.loadSpecialties();
          },
          (error) => {
            console.error('Error creating specialty:', error);
          }
        );
      }
    }
  }

  confirmDeleteSpecialty(specialty: Specialty): void {
    this.specialtyToDelete = specialty;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.specialtyToDelete = null;
  }

    deleteSpecialty(): void {
    if (this.specialtyToDelete) {
      this.specialtyService.deleteSpecialty(this.specialtyToDelete.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadSpecialties();
        },
        error: (error) => {
          console.error('Error deleting specialty:', error);
          this.showDeleteModal = false;
          this.specialtyToDelete = null;
        }
      });
    }
  }
}
