import { Routes } from '@angular/router';
import { ColofonComponent } from './components/views/colofon/colofon.component';
import { ContactComponent } from './components/views/contact/contact.component';
import { HomeComponent } from './components/views/home/home.component';
import { SearchComponent } from './components/views/search/search.component';
import { MapComponent } from './components/views/map/map.component';

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
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'map',
    component: MapComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  },
];
