import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import {DoctorsListComponent} from "./pages/doctors-list/doctors-list.component";

export const routes: Routes = [
  {
    path: '', component: HomeComponent,
  },
  {
    path: 'doctors', component: DoctorsComponent, children: [
      {
        path: '', component: DoctorsListComponent
      },
      {
        path: 'doctorprofile/:id', component: DoctorProfileComponent
      }
    ]
  }
];
