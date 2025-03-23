import {Component, OnInit} from '@angular/core';
import {Article} from "../../../core/interfaces/article";
import {ArticleService} from "../../../core/services/article/article.service";
import {RouterLink} from "@angular/router";
import {DatePipe, NgForOf, SlicePipe} from "@angular/common";

@Component({
  selector: 'app-articles-list',
  standalone: true,
  imports: [
    RouterLink,
    SlicePipe,
    NgForOf,
    DatePipe
  ],
  templateUrl: './articles-list.component.html',
  styleUrl: './articles-list.component.css'
})
export class ArticlesListComponent implements OnInit {
  articles: any[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;
  ngOnInit(): void {
    this.loadDoctors()
  }
  constructor(private articleService : ArticleService ) {
  }
  loadDoctors(): void {
    this.articleService.getAllArticles(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.articles = response.content;
        this.totalItems = response.totalElements;
        console.log(this.articles);
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }
  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadDoctors();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

}
