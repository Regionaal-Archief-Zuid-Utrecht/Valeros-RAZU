import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIcon } from '@ng-icons/core';
import { faImage } from '@ng-icons/font-awesome/regular';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterService } from '../../../services/search/filter.service';
import { UiService } from '../../../services/ui.service';
import { FilterCountComponent } from '../filter-options/filter-count/filter-count.component';

@Component({
  selector: 'app-image-filter',
  standalone: true,
  imports: [
    NgIcon,
    FilterCountComponent,
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    TranslatePipe,
  ],
  templateUrl: './image-filter.component.html',
  styleUrl: './image-filter.component.scss',
})
export class ImageFilterComponent {
  constructor(
    public ui: UiService,
    public filters: FilterService,
  ) {}

  protected readonly faImage = faImage;

  onToggle($event: MouseEvent) {
    const onlyShowResultsWithImages =
      this.filters.onlyShowResultsWithImages.value;
    this.filters.onlyShowResultsWithImages.next(!onlyShowResultsWithImages);
  }
}
