import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { DoctorProfileComponent } from './pages/doctor-profile/doctor-profile.component';
import { DoctorsComponent } from './pages/doctors/doctors.component';
import {DoctorsListComponent} from "./pages/doctors-list/doctors-list.component";
import {ArticlesComponent} from "./pages/articles/articles.component";
import {ArticlesListComponent} from "./pages/articles-list/articles-list.component";
import {ArticleDetailsComponent} from "./pages/article-details/article-details.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {LoginComponent} from "./pages/auth/login/login.component";
import {AdminComponent} from "./pages/dashboard/dashboardAdmin/admin/admin.component";
import {authGuard} from "./core/guards/auth.guard";
import {CitiesComponent} from "./pages/dashboard/dashboardAdmin/cities/cities.component";
import {CategoriesComponent} from "./pages/dashboard/dashboardAdmin/categories/categories.component";

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
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'admin', component: AdminComponent, canActivate: [authGuard] , children: [
      {
        path: 'cities', component: CitiesComponent,
      },
      {
        path: 'categories', component: CategoriesComponent
      }
    ]

  }
];
