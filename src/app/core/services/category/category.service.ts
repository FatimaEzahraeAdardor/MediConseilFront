import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {City} from "../../interfaces/city";
import {Category} from "../../interfaces/category";
import {Page} from "../doctor/doctor-service";

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8080/api/categories';

  constructor(private http: HttpClient) { }

  // Get all cities
  getCategories(page: number, size: number): Observable<Page<Category>> {
    return this.http.get<Page<Category>>(`${this.apiUrl}?page=${page}&size=${size}`);
  }

  // Get a single category by ID
  getCategory(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Create a new city
  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.apiUrl}/save`, category);
  }

  // Update an existing category
  updateCategory(id: string, category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/update/${id}`, category);
  }

  // Delete a category
  deleteCategory(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    });
  }

}
