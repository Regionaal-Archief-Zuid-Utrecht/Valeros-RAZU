import { Routes } from '@angular/router';
import { AccessibilityEvaluationComponent } from './components/views/accessibility-evaluation/accessibility-evaluation.component';
import { ColofonComponent } from './components/views/colofon/colofon.component';
import { HomeComponent } from './components/views/home/home.component';
import { SearchComponent } from './components/views/search/search.component';
import { SitemapComponent } from './components/views/sitemap/sitemap.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'search',
    component: SearchComponent,
  },
  {
    path: 'colofon',
    component: ColofonComponent,
  },
  {
    path: 'details/:id',
    component: SearchComponent,
  },
  {
    path: 'sitemap',
    component: SitemapComponent,
  },
  {
    path: 'toegankelijkheidsverklaring',
    component: AccessibilityEvaluationComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
