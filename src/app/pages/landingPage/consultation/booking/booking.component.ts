// booking.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Router, RouterModule } from '@angular/router';
import {DoctorService} from "../../../../core/services/doctor/doctor-service";
import {AvailabilityService} from "../../../../core/services/availabilities/availability.service";
import {ConsultationService} from "../../../../core/services/consultation/consultation.service";
import {AuthService} from "../../../../core/services/auth/auth.service";
import {Doctor} from "../../../../core/interfaces/doctor";
import {Availability} from "../../../../core/interfaces/availability";
import {Consultation} from "../../../../core/interfaces/consultation";

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {
  step = 1; // 1: Choose doctor, 2: Choose time slot, 3: Confirm
  doctors: Doctor[] = [];
  availabilities: Availability[] = [];
  selectedDoctor: Doctor | null = null;
  selectedAvailability: Availability | null = null;
  consultationForm!: FormGroup;
  isLoading = false;
  error: string | null = null;
  success: string | null = null;

  // Date selection properties
  dates: Date[] = [];
  selectedDate: Date | null = null;

  constructor(
    private fb: FormBuilder,
    private doctorService: DoctorService,
    private availabilityService: AvailabilityService,
    private consultationService: ConsultationService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
    this.loadDoctors();
    this.generateDates();
  }

  initForm() {
    this.consultationForm = this.fb.group({
      motif: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
    });
  }

  generateDates() {
    this.dates = [];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1); // Start from tomorrow

    // Generate dates for the next 14 days starting from tomorrow
    for (let i = 0; i < 14; i++) {
      const date = new Date();
      date.setDate(tomorrow.getDate() + i);

      // Reset the time to midnight to avoid timezone issues
      date.setHours(0, 0, 0, 0);

      this.dates.push(date);
    }
  }

  loadDoctors() {
    this.isLoading = true;
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        this.doctors = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des médecins. Veuillez réessayer.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectDoctor(doctor: Doctor) {
    this.selectedDoctor = doctor;
    this.step = 2;
    this.selectedDate = null;
    this.selectedAvailability = null;
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.selectedAvailability = null;
    this.loadAvailabilities();
  }

  loadAvailabilities() {
    if (!this.selectedDate || !this.selectedDoctor) return;

    this.isLoading = true;
    const formattedDate = this.formatDateForApi(this.selectedDate);

    // Utiliser la méthode pour générer automatiquement les disponibilités
    this.availabilityService.getGeneratedAvailabilities(this.selectedDoctor.id, formattedDate).subscribe({
      next: (data) => {
        this.availabilities = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = "Erreur lors du chargement des disponibilités. Veuillez réessayer.";
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  selectAvailability(availability: Availability) {
    this.selectedAvailability = availability;
    this.step = 3;
  }

  submitBooking() {
    if (this.consultationForm.invalid || !this.selectedDoctor || !this.selectedAvailability) {
      return;
    }

    const userId = this.authService.getUserId();

    if (!userId) {
      this.error = "Vous devez être connecté pour réserver une consultation";
      return;
    }

    this.isLoading = true;

    // Ensure the dateConsultation has the correct format with seconds
    const startDateTime = new Date(this.selectedAvailability.startTime);
    const formattedDateTime = startDateTime.toISOString().replace('Z', '');

    // Créez l'objet consultation avec la date de consultation
    const consultation = {
      patientId: userId,
      doctorId: this.selectedDoctor.id,
      motif: this.consultationForm.get('motif')?.value,
      availabilityId: this.selectedAvailability.id,
      dateConsultation: formattedDateTime // Using ISO format with seconds
    };

    console.log('Consultation payload:', consultation);

    this.consultationService.bookConsultation(consultation).subscribe({
      next: (response) => {
        this.success = "Votre consultation a été réservée avec succès!";
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/consultations']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error details:', err);
        this.error = err.error?.message ||
          (err.error?.errors ? Object.values(err.error.errors).join(', ') :
            "Une erreur est survenue lors de la réservation. Veuillez réessayer.");
        this.isLoading = false;
      }
    });
  }

  backToStep(step: number) {
    this.step = step;
    if (step === 1) {
      this.selectedDoctor = null;
    } else if (step === 2) {
      this.selectedAvailability = null;
    }
  }

  // Format date helpers
  formatDateForApi(date: Date): string {
    // Ensure consistent date format (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  formatDate(date: Date): string {
    // Format as "Lun. 12 Jan"
    return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
  }

  formatDateTime(dateTime: string): string {
    if (!dateTime) return '';

    return new Date(dateTime).toLocaleString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatTime(dateTime: string): string {
    if (!dateTime) return '';

    return new Date(dateTime).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}
