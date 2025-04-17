import { NgForOf, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NodeImagesComponent } from '../../../../node-images/node-images.component';
import { NodeLinkComponent } from '../../../../node-link/node-link.component';
import { HopComponent } from '../hop.component';

@Component({
  selector: 'app-hop-image',
  standalone: true,
  imports: [NgIf, NgForOf, NgIcon, NodeLinkComponent, NodeImagesComponent],
  templateUrl: './hop-image.component.html',
  styleUrl: './hop-image.component.scss',
})
export class HopImageComponent extends HopComponent {}
