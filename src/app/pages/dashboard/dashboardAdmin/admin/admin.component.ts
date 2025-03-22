import { Component, OnInit } from '@angular/core';
import { NgClass, DatePipe, CurrencyPipe, NgIf } from "@angular/common";
import { RouterModule } from '@angular/router';
import { AuthService } from "../../../../core/services/auth/auth.service";
import { User } from "../../../../core/interfaces/user";

interface ActivityItem {
  // Add your ActivityItem properties here if needed
  id?: string;
  type?: string;
  title?: string;
  description?: string;
  date?: Date;
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    NgClass,
    DatePipe,
    RouterModule,
    CurrencyPipe,
    NgIf
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  sidebarOpen = true;
  currentUser: User | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUserById().subscribe(user => {
      this.currentUser = user;
      console.log(this.currentUser);
      this.sidebarOpen = window.innerWidth >= 768;
    });
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  logout(): void {
    this.authService.logout();
  }
}
