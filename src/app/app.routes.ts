import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import {DoctorsListComponent} from "./pages/doctors-list/doctors-list.component";
import {ArticlesComponent} from "./pages/articles/articles.component";
import {ArticlesListComponent} from "./pages/articles-list/articles-list.component";
import {ArticleDetailsComponent} from "./pages/article-details/article-details.component";
import {RegisterComponent} from "./pages/auth/register/register.component";

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
  },
  {
    path: 'articles', component: ArticlesComponent, children: [
      {
        path: '', component: ArticlesListComponent
      },
      {
        path: ':id', component: ArticleDetailsComponent
      }

    ]
  },
  {
    path: 'register', component: RegisterComponent
  }
];
