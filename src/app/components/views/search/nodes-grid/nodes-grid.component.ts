import { NgForOf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { NodeModel } from '../../../../models/node.model';
import { NodeComponent } from '../../../features/node/node.component';

@Component({
  selector: 'app-nodes-grid',
  imports: [NgForOf, NodeComponent],
  templateUrl: './nodes-grid.component.html',
  styleUrl: './nodes-grid.component.css'
})
export class NodesGridComponent {
  @Input() nodes?: NodeModel[];
}
