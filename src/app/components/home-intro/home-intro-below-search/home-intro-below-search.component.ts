import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
  selector: 'app-home-intro-below-search',
  standalone: true,
  imports: [TranslocoModule],
  templateUrl: './home-intro-below-search.component.html',
  styleUrl: './home-intro-below-search.component.scss',
})
export class HomeIntroBelowSearchComponent {
  constructor(public router: Router) {}
}
