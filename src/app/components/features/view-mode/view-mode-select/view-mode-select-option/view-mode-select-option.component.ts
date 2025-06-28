import { NgClass, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { ViewMode } from '../../../../../models/view-mode.enum';
import { ViewModeService } from '../../../../../services/view-mode.service';

@Component({
    selector: 'app-view-mode-select-option',
    imports: [NgIf, NgClass, NgIcon],
    templateUrl: './view-mode-select-option.component.html',
    styleUrl: './view-mode-select-option.component.scss'
})
export class ViewModeSelectOptionComponent {
  @Input() viewMode!: ViewMode;
  @Input() iconSvg?: string;

  constructor(public viewModes: ViewModeService) {}
}
