// cities.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { City } from "../../../../core/interfaces/city";
import { CityService } from "../../../../core/services/city.service";

@Component({
  selector: 'app-cities',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {
  cities: City[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  cityForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentCityId: string | null = null;

  // Delete modal properties
  showDeleteModal = false;
  cityToDelete: City | null = null;

  // Region filter properties
  regions: string[] = [];
  selectedRegion: string = '';

  constructor(
    private citiesService: CityService,
    private fb: FormBuilder
  ) {
    this.cityForm = this.fb.group({
      name: ['', [Validators.required]],
      region: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadRegions();
    this.loadCities();
  }

  loadRegions(): void {
    this.citiesService.getRegions().subscribe(
      (regions: string[]) => {
        this.regions = regions;
      },
      (error) => {
        console.error('Error fetching regions:', error);
      }
    );
  }

  loadCities(): void {
    if (this.selectedRegion) {
      this.citiesService.getCitiesByRegion(this.selectedRegion, this.currentPage, this.pageSize).subscribe(
        (response: any) => {
          this.cities = response.content;
          this.totalItems = response.totalElements;
        },
        (error) => {
          console.error('Error fetching cities by region:', error);
        }
      );
    } else {
      this.citiesService.getCities(this.currentPage, this.pageSize).subscribe(
        (response: any) => {
          this.cities = response.content;
          this.totalItems = response.totalElements;
        },
        (error) => {
          console.error('Error fetching cities:', error);
        }
      );
    }
  }

  onRegionChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedRegion = select.value;
    this.currentPage = 0;
    this.loadCities();
  }

  resetFilter(): void {
    this.selectedRegion = '';
    this.currentPage = 0;
    this.loadCities();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCities();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Modal management
  openAddCityModal(): void {
    this.isEditing = false;
    this.currentCityId = null;
    this.cityForm.reset();
    this.showModal = true;
  }

  editCity(city: City): void {
    this.isEditing = true;
    this.currentCityId = city.id;
    this.cityForm.setValue({
      name: city.name,
      region: city.region
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.cityForm.reset();
  }

  saveCity(): void {
    if (this.cityForm.valid) {
      const cityData: City = {
        id: this.currentCityId || '',
        name: this.cityForm.value.name,
        region: this.cityForm.value.region
      };

      if (this.isEditing && this.currentCityId) {
        this.citiesService.updateCity(this.currentCityId, cityData).subscribe(
          () => {
            this.closeModal();
            this.loadCities();
            this.loadRegions(); // Refresh regions list
          },
          (error) => {
            console.error('Error updating city:', error);
          }
        );
      } else {
        this.citiesService.createCity(cityData).subscribe(
          () => {
            this.closeModal();
            this.loadCities();
            this.loadRegions(); // Refresh regions list
          },
          (error) => {
            console.error('Error creating city:', error);
          }
        );
      }
    }
  }

  confirmDeleteCity(city: City): void {
    this.cityToDelete = city;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.cityToDelete = null;
  }

  deleteCity(): void {
    if (this.cityToDelete) {
      this.citiesService.deleteCity(this.cityToDelete.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadCities();
          this.loadRegions(); // Refresh regions list
        },
        error: (error) => {
          console.error('Error deleting city:', error);
          this.showDeleteModal = false;
          this.cityToDelete = null;
        }
      });
    }
  }
}
