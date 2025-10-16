import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgIcon } from '@ng-icons/core';
import { featherX } from '@ng-icons/feather-icons';
import { TranslatePipe } from '@ngx-translate/core';
import { UrlService } from '../../../services/url.service';
import { HeaderComponent, HeaderView } from '../../ui/header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';

@Component({
  selector: 'app-colofon',
  imports: [
    HeaderComponent,
    ViewContainerComponent,
    NgClass,
    TranslatePipe,
    NgIcon,
    RouterLink
],
  templateUrl: './colofon.component.html',
  styleUrl: './colofon.component.scss',
})
export class ColofonComponent implements OnInit {
  protected readonly HeaderView = HeaderView;
  protected readonly featherX = featherX;
  constructor(
    public router: Router,
    public url: UrlService,
  ) {}

  async ngOnInit() {}

  async onButtonClicked(url: string) {
    this.url.ignoreQueryParamChange = true;
    await this.router.navigateByUrl(url);
    this.url.ignoreQueryParamChange = false;
  }
}
