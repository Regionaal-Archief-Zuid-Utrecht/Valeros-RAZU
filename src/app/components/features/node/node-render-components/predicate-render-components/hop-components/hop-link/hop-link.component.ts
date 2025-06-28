import { NgForOf, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { featherChevronRight } from '@ng-icons/feather-icons';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { HopComponent } from '../hop.component';

@Component({
    selector: 'app-hop-link',
    imports: [NgIf, NodeLinkComponent, NgForOf, NgIcon],
    templateUrl: './hop-link.component.html',
    styleUrl: './hop-link.component.css'
})
export class HopLinkComponent extends HopComponent implements OnInit {
  protected readonly featherChevronRight = featherChevronRight;
}
