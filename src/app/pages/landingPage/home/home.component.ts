import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {HeaderComponent} from "../../shared/header/header.component";
import {FooterComponent} from "../../shared/footer/footer.component";
import {DoctorService} from "../../../core/services/doctor/doctor-service";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NgForOf
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  doctors: any[] = [];
  currentPage = 0;
  pageSize = 4;
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
        console.error('Error fetching doctorsList:', error);
      }
    );
  }

}
