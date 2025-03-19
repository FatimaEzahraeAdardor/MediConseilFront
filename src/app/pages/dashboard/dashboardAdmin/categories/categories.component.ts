import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Category} from "../../../../core/interfaces/category";
import {CategoryService} from "../../../../core/services/category.service";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  categoryForm: FormGroup;
  showModal = false;
  isEditing = false;
  currentcategoryId: string | null = null;

  // Delete modal properties
  showDeleteModal = false;
  categoryToDelete: Category | null = null;

  constructor(
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
      this.categoryService.getCategories(this.currentPage, this.pageSize).subscribe(
        (response) => {
          this.categories = response.content;
          this.totalItems = response.totalElements;
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
    }


  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCategories();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  // Modal management
  openAddCategoryModal(): void {
    this.isEditing = false;
    this.currentcategoryId = null;
    this.categoryForm.reset();
    this.showModal = true;
  }

  editCategory(category: Category): void {
    this.isEditing = true;
    this.currentcategoryId = category.id;
    this.categoryForm.setValue({
      name: category.name,
      description: category.description
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.categoryForm.reset();
  }

  saveCategory(): void {
    if (this.categoryForm.valid) {
      const categoryData: Category = {
        id: this.currentcategoryId || '',
        name: this.categoryForm.value.name,
        description: this.categoryForm.value.description
      };

      if (this.isEditing && this.currentcategoryId) {
        this.categoryService.updateCategory(this.currentcategoryId, categoryData).subscribe(
          () => {
            this.closeModal();
            this.loadCategories();
          },
          (error) => {
            console.error('Error updating category:', error);
          }
        );
      } else {
        this.categoryService.createCategory(categoryData).subscribe(
          () => {
            this.closeModal();
            this.loadCategories();
          },
          (error) => {
            console.error('Error creating category:', error);
          }
        );
      }
    }
  }

  confirmDeleteCategory(category: Category): void {
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.categoryToDelete = null;
  }

  deleteCategory(): void {
    if (this.categoryToDelete) {
      this.categoryService.deleteCategory(this.categoryToDelete.id).subscribe({
        next: () => {
          this.closeDeleteModal();
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting city:', error);
          this.showDeleteModal = false;
          this.categoryToDelete = null;
        }
      });
    }
  }
}
