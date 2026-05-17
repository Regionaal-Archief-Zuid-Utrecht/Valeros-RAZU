import { Component, OnInit } from '@angular/core';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { HopTrailComponent } from '../hop-trail/hop-trail.component';
import { HopComponent } from '../hop.component';

@Component({
  selector: 'app-hop-link',
  imports: [NodeLinkComponent, HopTrailComponent],
  templateUrl: './hop-link.component.html',
  styleUrl: './hop-link.component.css',
})
export class HopLinkComponent extends HopComponent implements OnInit {
  protected readonly featherChevronRight = featherChevronRight;
}
