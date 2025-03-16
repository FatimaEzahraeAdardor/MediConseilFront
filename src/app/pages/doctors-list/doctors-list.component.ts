import {Component, OnInit} from '@angular/core';
import {FooterComponent} from "../shared/footer/footer.component";
import {NgForOf, NgIf} from "@angular/common";
import {DoctorService} from "../../core/services/doctor-service";
import {RouterLink, RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-doctors-list',
  standalone: true,
  imports: [
    NgForOf,
    RouterLink

  ],
  templateUrl: './doctors-list.component.html',
  styleUrl: './doctors-list.component.css'
})
export class DoctorsListComponent implements OnInit {
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
