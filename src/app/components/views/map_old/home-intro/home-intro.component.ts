import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-home-intro',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './home-intro.component.html',
  styleUrl: './home-intro.component.css',
})
export class HomeIntroComponent {
  constructor(
    public router: Router,
    public translate: TranslateService,
  ) {}
}
