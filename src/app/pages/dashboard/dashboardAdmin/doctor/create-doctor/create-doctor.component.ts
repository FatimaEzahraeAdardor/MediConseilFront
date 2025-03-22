import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { DoctorService } from '../../../../../core/services/doctor/doctor-service';
import { Doctor } from '../../../../../core/interfaces/doctor';
import { City } from '../../../../../core/interfaces/city';
import { Specialty } from '../../../../../core/interfaces/specialty';
import { CityService } from '../../../../../core/services/city/city.service';
import { SpecialtyService } from '../../../../../core/services/specialty/specialty.service';

@Component({
  selector: 'app-create-doctor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule
  ],
  templateUrl: './create-doctor.component.html',
  styleUrl: './create-doctor.component.css'
})
export class CreateDoctorComponent implements OnInit {
  doctorForm: FormGroup;
  cities: City[] = [];
  specialties: Specialty[] = [];
  isSubmitting = false;
  imagePreview: string | null = null;
  imageSelected: string | null = null;
  isPasswordVisible = false;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private cityService: CityService,
    private specialtyService: SpecialtyService,
    private router: Router
  ) {
    this.doctorForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadCities();
    this.loadSpecialties();
  }

  createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      specialtyId: [null, [Validators.required]],
      cityId: [null, [Validators.required]],
      address: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.min(0)]],
      diploma: ['', [Validators.required]],
      experiences: [''],
      description: [''],
      image: ['']
    });
  }

  loadCities(): void {
    this.cityService.getCitiesList().subscribe({
      next: (cities) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
      }
    });
  }

  loadSpecialties(): void {
    this.specialtyService.getAllSpecialties().subscribe({
      next: (specialties) => {
        this.specialties = specialties;
      },
      error: (error) => {
        console.error('Error loading specialties:', error);
      }
    });
  }

  saveDoctor(): void {
    if (this.doctorForm.valid) {
      this.isSubmitting = true;
      const doctorData = this.doctorForm.value;

      this.doctorService.createDoctor(doctorData).subscribe({
        next: (response) => {
          console.log('Doctor created successfully:', response);
          this.router.navigate(['admin/doctors']);
        },
        error: (error) => {
          console.error('Error creating doctor:', error);
          this.isSubmitting = false;
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      // Marquer tous les champs comme touchés pour afficher les erreurs
      Object.keys(this.doctorForm.controls).forEach(key => {
        const control = this.doctorForm.get(key);
        control?.markAsTouched();
      });
      console.log('Form is invalid');
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imageSelected = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        this.doctorForm.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.imageSelected = null;
    this.doctorForm.patchValue({ image: '' });
  }

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }
}
