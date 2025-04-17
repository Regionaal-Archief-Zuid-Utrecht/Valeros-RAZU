import { NgForOf } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { NgxMasonryModule } from 'ngx-masonry';
import { NodeModel } from '../../models/node.model';
import { ViewMode } from '../../models/view-mode.enum';
import { NodeComponent } from '../node/node.component';

@Component({
  selector: 'app-nodes-masonry-grid',
  standalone: true,
  imports: [NgxMasonryModule, NodeComponent, NgForOf],
  templateUrl: './nodes-masonry-grid.component.html',
  styleUrl: './nodes-masonry-grid.component.scss',
})
export class NodesMasonryGridComponent implements OnInit {
  @Input() nodes?: NodeModel[];

  updateMasonryLayoutTrigger = false;

  constructor() {}

  ngOnInit() {
    this.initMasonryLayoutUpdates();
  }

  initMasonryLayoutUpdates() {
    // TODO: Optimize if needed, fixes occasional layout errors after reactive component height changes
    setInterval(() => {
      this.updateMasonryLayout();
    }, 200);
  }

  updateMasonryLayout() {
    this.updateMasonryLayoutTrigger = true;
    setTimeout(() => {
      this.updateMasonryLayoutTrigger = false;
    }, 10);
  }

  get gridNodeWidthStr(): string {
    const columns = 2;
    return (100 / columns).toString() + '%';
  }
  protected readonly ViewMode = ViewMode;
}
