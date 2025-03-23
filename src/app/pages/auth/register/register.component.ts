import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from "../../../core/services/auth/auth.service";
import { CityService } from "../../../core/services/city/city.service";
import {City} from "../../../core/interfaces/city";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  cities: City[] = [];
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cityService: CityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadCities();
  }

  initForm(): void {
    this.registerForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      userName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15)]],
      city_id: [null, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
    }, { validators: this.passwordMatchValidator.bind(this) });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  loadCities(): void {
    this.cityService.getCitiesList().subscribe({
      next: (data) => {
        this.cities = data;
      },
      error: (error) => {
        console.error('Error loading cities:', error);
        this.errorMessage = 'Impossible de charger la liste des villes.';
      }
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  passwordsDoNotMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;

    if (password !== undefined && confirmPassword !== undefined) {
      return password !== confirmPassword && !!this.registerForm.get('confirmPassword')?.touched;
    }
    return false;
  }
  onSubmit(): void {
    if (this.registerForm.valid) {
      this.errorMessage = '';

      // Create registration request object from form values - remove confirmPassword field
      const registerRequest = {
        firstName: this.registerForm.get('firstName')?.value,
        lastName: this.registerForm.get('lastName')?.value,
        userName: this.registerForm.get('userName')?.value,
        email: this.registerForm.get('email')?.value,
        phoneNumber: this.registerForm.get('phoneNumber')?.value,
        city_id: this.registerForm.get('city_id')?.value,
        password: this.registerForm.get('password')?.value
      };

      this.authService.register(registerRequest).subscribe({
        next: (response) => {
          this.router.navigate(['/login'], {
            queryParams: {registered: 'success'}
          });
        },
        error: (error) => {
          console.error('Registration error:', error);

          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 409) {
            this.errorMessage = 'Un utilisateur avec ce nom d\'utilisateur ou cette adresse e-mail existe déjà.';
          } else {
            this.errorMessage = 'Une erreur s\'est produite lors de l\'inscription. Veuillez réessayer.';
          }
        }
      });
    } else {
      console.log('Form is invalid');
    }
  }
}
