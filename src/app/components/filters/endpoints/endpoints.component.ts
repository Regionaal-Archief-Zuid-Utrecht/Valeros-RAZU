import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Settings } from '../../../config/settings';
import { EndpointService } from '../../../services/endpoint.service';
import { FilterService } from '../../../services/search/filter.service';
import { SearchService } from '../../../services/search/search.service';
import { UiService } from '../../../services/ui.service';
import { FilterCountComponent } from '../filter-options/filter-count/filter-count.component';

@Component({
  selector: 'app-endpoints',
  standalone: true,
  imports: [NgForOf, FilterCountComponent, FormsModule, TranslatePipe],
  templateUrl: './endpoints.component.html',
  styleUrl: './endpoints.component.scss',
})
export class EndpointsComponent {
  constructor(
    public endpoints: EndpointService,
    public filters: FilterService,
    public search: SearchService,
    public ui: UiService,
  ) {}

  protected readonly Settings = Settings;
  protected readonly Object = Object;
}
