import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FilterType } from '../../../../models/filters/filter.model';

@Component({
  selector: 'app-filter-count',
  standalone: true,
  imports: [NgIf, TranslatePipe],
  templateUrl: './filter-count.component.html',
  styleUrl: './filter-count.component.scss',
})
export class FilterCountComponent {
  @Input() count?: string;
  protected readonly FilterType = FilterType;
}
