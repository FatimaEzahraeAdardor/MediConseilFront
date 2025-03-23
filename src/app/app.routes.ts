import { Routes } from '@angular/router';
import { HomeComponent } from './pages/landingPage/home/home.component';
import { DoctorProfileComponent } from './pages/landingPage/doctor-profile/doctor-profile.component';
import { DoctorsComponent } from './pages/landingPage/doctors/doctors.component';
import { DoctorsListComponent as AdminDoctorComponent} from './pages/dashboard/dashboardAdmin/doctor/doctorsList/doctorsList.component';
import {DoctorsListComponent} from "./pages/landingPage/doctors-list/doctors-list.component";
import {ArticlesComponent} from "./pages/landingPage/articles/articles.component";
import {ArticlesListComponent} from "./pages/landingPage/articles-list/articles-list.component";
import {ArticleListComponent} from "./pages/dashboard/dashboardAdmin/article/article-list/article-list.component";
import {ArticleDetailsComponent} from "./pages/landingPage/article-details/article-details.component";
import {ArticleDetailsComponent as AdminArticleListComponenet} from "./pages/dashboard/dashboardAdmin/article/article-details/article-details.component";
import {RegisterComponent} from "./pages/auth/register/register.component";
import {LoginComponent} from "./pages/auth/login/login.component";
import {AdminComponent} from "./pages/dashboard/dashboardAdmin/admin/admin.component";
import {authGuard} from "./core/guards/auth.guard";
import {CitiesComponent} from "./pages/dashboard/dashboardAdmin/cities/cities.component";
import {CategoriesComponent} from "./pages/dashboard/dashboardAdmin/categories/categories.component";
import {CreateDoctorComponent} from "./pages/dashboard/dashboardAdmin/doctor/create-doctor/create-doctor.component";
import {DoctorDetailsComponent} from "./pages/dashboard/dashboardAdmin/doctor/doctor-details/doctor-details.component";


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
      },
      {
        path: 'doctors', component: AdminDoctorComponent
      },
      {
        path: 'create', component: CreateDoctorComponent
      },
      {
        path: 'doctor/:id', component: DoctorDetailsComponent
      },
      {
        path: 'articles', component: ArticleListComponent
      },
      {
        path: 'article/:id', component: AdminArticleListComponenet
      }
    ]

  }
];
