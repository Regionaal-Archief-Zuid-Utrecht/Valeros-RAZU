import { Component, Input } from '@angular/core';
import { FilterType } from '../../../../models/filter.model';
import { NgIf } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';

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
