import { Component, OnInit } from '@angular/core';
import { Article } from "../../../../../core/interfaces/article";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { ArticleService } from "../../../../../core/services/article/article.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './article-details.component.html',
  styleUrl: './article-details.component.css'
})
export class ArticleDetailsComponent implements OnInit {
  articleId: string = '';
  article: Article | null = null;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private articleService: ArticleService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
      if (this.articleId) {
        this.loadArticleDetails();
      } else {
        this.errorMessage = "Identifiant de l'article manquant";
        this.isLoading = false;
      }
    });
  }

  loadArticleDetails(): void {
    this.isLoading = true;
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
        console.log('Article data:', this.article);
      },
      error: (err) => {
        console.error('Error fetching article details:', err);
        this.errorMessage = "Impossible de charger les détails de l'article";
        this.isLoading = false;
      }
    });
  }

  formatDate(date: string): string {
    if (!date) return '';

    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };

    return new Date(date).toLocaleDateString('fr-FR', options);
  }
}
