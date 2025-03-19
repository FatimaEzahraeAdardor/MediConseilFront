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
  filteredCities: City[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  Math = Math; // For using Math in the template

  // Form and modal properties
  cityForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentCityId: string | null = null;

  // Delete modal properties
  showDeleteModal = false;
  cityToDelete: City | null = null;

  // Search and filter
  searchTerm = '';
  selectedRegion = '';
  regions: string[] = [];

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
    this.loadCities();
    this.extractRegions();
  }

  loadCities(): void {
    this.citiesService.getCities(this.currentPage, this.pageSize).subscribe(
      (response: any) => {
        this.cities = response.content;
        this.filteredCities = [...this.cities];
        this.totalItems = response.totalElements;
        this.extractRegions();
      },
      (error) => {
        console.error('Error fetching cities:', error);
      }
    );
  }

  extractRegions(): void {
    // Extract unique regions from cities
    const uniqueRegions = new Set<string>();
    this.cities.forEach(city => {
      if (city.region) {
        uniqueRegions.add(city.region);
      }
    });
    this.regions = Array.from(uniqueRegions).sort();
  }

  filterCities(): void {
    this.filteredCities = this.cities.filter(city => {
      const matchesSearch = this.searchTerm === '' ||
        city.name.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesRegion = this.selectedRegion === '' ||
        city.region === this.selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }

  filterByRegion(): void {
    if (this.selectedRegion === '') {
      this.loadCities();
    } else {
      this.citiesService.getCitiesByRegion(this.selectedRegion, this.currentPage, this.pageSize).subscribe(
        (response: any) => {
          this.cities = response.content;
          this.filteredCities = [...this.cities];
          this.totalItems = response.totalElements;
        },
        (error) => {
          console.error('Error fetching cities by region:', error);
        }
      );
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;

    if (this.selectedRegion !== '') {
      this.filterByRegion();
    } else {
      this.loadCities();
    }
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Get visible page numbers (for pagination display)
  getVisiblePages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const current = this.currentPage;
    const pages = [];

    // Always show first page, last page, current page, and 1 page before and after current
    for (let i = 0; i < totalPages; i++) {
      if (
        i === 0 || // First page
        i === totalPages - 1 || // Last page
        (i >= current - 1 && i <= current + 1) // Current page and neighbors
      ) {
        pages.push(i);
      } else if (
        (i === current - 2 && current > 2) ||
        (i === current + 2 && current < totalPages - 3)
      ) {
        // Add ellipsis (represented as -1)
        pages.push(-1);
      }
    }

    // Remove duplicates
    return [...new Set(pages)];
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
          },
          (error) => {
            console.error('Error creating city:', error);
          }
        );
      }
    }
  }

  // Delete city functionality
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
          // Directly set modal state instead of calling method
          this.closeDeleteModal();
          this.loadCities();
        },
        error: (error) => {
          console.error('Error deleting city:', error);
          // Close modal even on error
          this.showDeleteModal = false;
          this.cityToDelete = null;
        }
      });
    }
  }
}
