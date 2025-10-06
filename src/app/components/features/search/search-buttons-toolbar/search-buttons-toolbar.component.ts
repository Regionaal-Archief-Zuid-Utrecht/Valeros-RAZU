import { NgClass, NgIf } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherHome } from '@ng-icons/feather-icons';
import { Settings } from '../../../../config/settings';
import { UiService } from '../../../../services/ui/ui.service';
import { UrlService } from '../../../../services/url.service';
import { ViewModeSelectComponent } from '../../view-mode/view-mode-select/view-mode-select.component';
import { FilterButtonComponent } from './filter-button/filter-button.component';

@Component({
  selector: 'app-search-buttons-toolbar',
  imports: [
    ViewModeSelectComponent,
    NgIf,
    NgClass,
    NgIcon,
    FilterButtonComponent,
  ],
  templateUrl: './search-buttons-toolbar.component.html',
})
export class SearchButtonsToolbarComponent implements OnInit {
  constructor(
    private url: UrlService,
    public ui: UiService,
  ) {}

  ngOnInit() {}

  async onHomeClicked() {
    await this.url.navigateByUrlIgnoringQueryParamChange('');
  }

  protected readonly Settings = Settings;
  protected readonly featherHome = featherHome;
}
