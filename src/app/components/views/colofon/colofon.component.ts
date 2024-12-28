import { Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { HeaderComponent, HeaderView } from '../../header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';
import { featherX } from '@ng-icons/feather-icons';
import { Router } from '@angular/router';
import { UrlService } from '../../../services/url.service';
import { TranslatePipe } from '@ngx-translate/core';
import { NgIcon } from '@ng-icons/core';

@Component({
  selector: 'app-colofon',
  standalone: true,
  imports: [HeaderComponent, ViewContainerComponent, NgClass, TranslatePipe, NgIcon],
  templateUrl: './colofon.component.html',
  styleUrl: './colofon.component.scss',
})
export class ColofonComponent {
  protected readonly HeaderView = HeaderView;
  protected readonly featherX = featherX;
  constructor(public router: Router, public url: UrlService) {}
  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }
}
