import { Routes } from '@angular/router';
import { ColofonComponent } from './components/views/colofon/colofon.component';
import { SearchComponent } from './components/views/search/search.component';

export const routes: Routes = [
  {
    path: '',
    component: SearchComponent,
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
    path: '**',
    redirectTo: '/',
  },
];
