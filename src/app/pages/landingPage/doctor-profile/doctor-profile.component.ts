import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Doctor } from "../../../core/interfaces/doctor";
import { DoctorService } from "../../../core/services/doctor/doctor-service";

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent implements OnInit {
  doctorId: string = '';
  doctor: Doctor | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private doctorService: DoctorService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.doctorId = params['id'];
      if (this.doctorId) {
        this.loadDoctorDetails();
      } else {
        this.errorMessage = "Identifiant du médecin manquant";
        this.isLoading = false;
      }
    });
  }

  loadDoctorDetails(): void {
    this.isLoading = true;
    this.doctorService.getDoctorById(this.doctorId).subscribe({
      next: (data) => {
        this.doctor = data;
        this.isLoading = false;
        console.log('Doctor data:', this.doctor);
      },
      error: (err) => {
        console.error('Error fetching admin details:', err);
        this.errorMessage = "Impossible de charger les détails du médecin";
        this.isLoading = false;
      }
    });
  }
}
