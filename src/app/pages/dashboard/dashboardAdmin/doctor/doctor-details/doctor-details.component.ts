import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../../../../core/interfaces/doctor";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {DoctorService} from "../../../../../core/services/doctor/doctor-service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-doctor-details',
  standalone: true,
  imports: [
    NgIf,
    RouterLink
  ],
  templateUrl: './doctor-details.component.html',
  styleUrl: './doctor-details.component.css'
})
export class DoctorDetailsComponent implements OnInit {
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
