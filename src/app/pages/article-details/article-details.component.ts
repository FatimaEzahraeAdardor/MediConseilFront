import {Component, OnInit} from '@angular/core';
import {Doctor} from "../../core/interfaces/doctor";
import {ActivatedRoute} from "@angular/router";
import {DoctorService} from "../../core/services/doctor-service";
import {Article} from "../../core/interfaces/article";
import {ArticleService} from "../../core/services/article.service";
import {DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-article-details',
  standalone: true,
  imports: [
    DatePipe,
    NgIf
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
    private articleService: ArticleService,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.articleId = params['id'];
      if (this.articleId) {
        this.loadDoctorDetails();
      } else {
        this.errorMessage = "Identifiant du article manquant";
        this.isLoading = false;
      }
    });
  }

  loadDoctorDetails(): void {
    this.isLoading = true;
    this.articleService.getArticleById(this.articleId).subscribe({
      next: (data) => {
        this.article = data;
        this.isLoading = false;
        console.log('article data:', this.article);
      },
      error: (err) => {
        console.error('Error fetching article details:', err);
        this.errorMessage = "Impossible de charger les détails du article";
        this.isLoading = false;
      }
    });
  }
}
