import {Component, OnInit} from '@angular/core';
import {Article} from "../../../../../core/interfaces/article";
import {ArticleService} from "../../../../../core/services/article/article.service";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";


@Component({
  selector: 'app-article-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    NgClass
  ],
  templateUrl: './article-list.component.html',
  styleUrl: './article-list.component.css'
})
export class ArticleListComponent implements OnInit {
  articles: Article[] = [];
  currentPage = 0;
  pageSize = 10;
  totalItems = 0;

  // Delete modal properties
  showDeleteModal = false;
  articleToDelete: Article | null = null;

  constructor(private articleService: ArticleService) {}

  ngOnInit(): void {
    this.loadArticles();
  }

  loadArticles(): void {
    this.articleService.getAllArticles(this.currentPage, this.pageSize).subscribe(
      (response) => {
        this.articles = response.content;
        this.totalItems = response.totalElements;
        console.log('articles loaded:', this.articles);
        console.log('Total items:', this.totalItems);
      },
      (error) => {
        console.error('Error fetching articles:', error);
      }
    );
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadArticles();
  }

  getPages(): number[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    console.log('Total pages:', totalPages);
    return Array.from({ length: totalPages }, (_, i) => i);
  }

  confirmDeleteArticle(article: Article): void {
    this.articleToDelete = article;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.articleToDelete = null;
  }

  deleteArticle(): void {
    if (this.articleToDelete) {
      this.articleService.deleteArticle(this.articleToDelete.id).subscribe({
        next: () => {
          console.log('article deleted successfully');
          this.closeDeleteModal();
          this.loadArticles();
        },
        error: (error: any) => {
          console.error('Error deleting doctor:', error);
          this.closeDeleteModal();
        }
      });
    }
  }
}
