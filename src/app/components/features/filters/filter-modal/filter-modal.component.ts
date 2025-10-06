import { Component, type OnInit } from '@angular/core';
import { FilterOptionsComponent } from "../filter-options/filter-options.component";

@Component({
  selector: 'app-filter-modal',
  imports: [FilterOptionsComponent],
  templateUrl: './filter-modal.component.html',
})
export class FilterModalComponent implements OnInit {
  ngOnInit(): void {}
}
