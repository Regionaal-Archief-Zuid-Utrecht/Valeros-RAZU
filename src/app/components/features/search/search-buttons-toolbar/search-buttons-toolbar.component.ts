import { NgClass, NgIf } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherFilter, featherHome } from '@ng-icons/feather-icons';
import { Settings } from '../../../../config/settings';
import { UrlService } from '../../../../services/url.service';
import { ViewModeSelectComponent } from '../../view-mode/view-mode-select/view-mode-select.component';

@Component({
  selector: 'app-search-buttons-toolbar',
  imports: [ViewModeSelectComponent, NgIf, NgClass, NgIcon],
  templateUrl: './search-buttons-toolbar.component.html',
})
export class SearchButtonsToolbarComponent implements OnInit {
  constructor(private url: UrlService) {}

  ngOnInit() {}

  async onHomeClicked() {
    await this.url.navigateByUrlIgnoringQueryParamChange('');
  }

  protected readonly Settings = Settings;
  protected readonly featherFilter = featherFilter;
  protected readonly featherHome = featherHome;
}
