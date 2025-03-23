import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../doctor/doctor-service";
import {Article} from "../../interfaces/article";
import {Doctor} from "../../interfaces/doctor";

@Injectable({
  providedIn: 'root'
})
export class ArticleService {
  private apiUrl = 'http://localhost:8080/api/articles';

  constructor(private http: HttpClient) { }
  getAllArticles(page: number, size: number): Observable<Page<Article>> {
    return this.http.get<Page<Article>>(`${this.apiUrl}/all?page=${page}&size=${size}`);
  }
  getArticleById(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }
  deleteArticle(id: string): Observable<string> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      responseType: 'text'
    }) as Observable<string>;
  }
}
