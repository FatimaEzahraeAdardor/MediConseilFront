import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../shared/footer/footer.component";
import {HeaderComponent} from "../shared/header/header.component";
import {DoctorService} from "../../core/services/doctor-service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-doctors',
  standalone: true,
  imports: [
    FooterComponent,
    HeaderComponent,
    NgForOf
  ],
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.css'
})
export class DoctorsComponent implements OnInit {
  doctors: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  ngOnInit(): void {
    this.loadDoctors()
  }
  constructor(private doctorService : DoctorService ) {
  }
  loadDoctors(): void {
    this.doctorService.getAllDoctors(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.doctors = response.content;
        this.totalItems = response.totalElements;
      },
      (error) => {
        console.error('Error fetching doctors:', error);
      }
    );
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctors();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

}
