import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../models/node.model';
import { NgForOf } from '@angular/common';
import { NgxMasonryModule } from 'ngx-masonry';
import { NodeComponent } from '../../node/node.component';

@Component({
  selector: 'app-nodes-table',
  standalone: true,
  imports: [NgForOf, NgxMasonryModule, NodeComponent],
  templateUrl: './nodes-table.component.html',
  styleUrl: './nodes-table.component.scss',
})
export class NodesTableComponent {
  @Input() nodes?: NodeModel[];
  ngOnChanges() {
    console.log(this.nodes);
  }
}
