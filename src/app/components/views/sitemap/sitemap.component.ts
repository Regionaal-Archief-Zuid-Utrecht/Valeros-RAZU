import { Component, type OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { featherArrowLeft } from '@ng-icons/feather-icons';
import { HeaderComponent, HeaderView } from '../../ui/header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';

@Component({
  selector: 'app-sitemap',
  imports: [
    ViewContainerComponent,
    RouterLink,
    NgIconComponent,
    HeaderComponent,
  ],
  templateUrl: './sitemap.component.html',
  styleUrl: './sitemap.component.scss',
})
export class SitemapComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  protected readonly featherArrowLeft = featherArrowLeft;
  protected readonly HeaderView = HeaderView;
}
