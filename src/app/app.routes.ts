import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {DoctorProfileComponent} from "./pages/doctor-profile/doctor-profile.component";
import {DoctorsComponent} from "./pages/doctors/doctors.component";

export const routes: Routes = [
  {
    path: '', component: HomeComponent,},
  {
    path: 'medecins', component: DoctorsComponent}
];
