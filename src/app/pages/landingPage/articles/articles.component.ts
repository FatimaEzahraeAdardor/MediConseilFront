import { Component } from '@angular/core';
import {FooterComponent} from "../../shared/footer/footer.component";
import {HeaderComponent} from "../../shared/header/header.component";
import {RouterOutlet} from "@angular/router";

@Component({
  selector: 'app-articles',
  standalone: true,
    imports: [
        FooterComponent,
        HeaderComponent,
        RouterOutlet
    ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.css'
})
export class ArticlesComponent {

}
