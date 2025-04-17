import { NgForOf } from '@angular/common';
import { Component } from '@angular/core';
import { Config } from '../../../../../../config/config';
import { Direction } from '../../../../../../models/node.model';
import { NodeRenderComponent } from '../../node-render.component';
import { NodeTableViewComponent } from '../../node-table-view/node-table-view.component';
import { HopImageComponent } from '../../predicate-render-components/hop-components/hop-image/hop-image.component';

@Component({
  selector: 'app-gescand-inventarisnummer',
  standalone: true,
  imports: [NodeTableViewComponent, NgForOf, HopImageComponent],
  templateUrl: './gescand-inventarisnummer.component.html',
  styleUrl: './gescand-inventarisnummer.component.scss',
})
export class GescandInventarisnummerComponent extends NodeRenderComponent {
  images: string[] = [];

  ngOnInit() {
    this.images = this.nodes.getObjValues(
      this.node,
      ['https://schema.org/isPartOf'],
      Direction.Incoming,
    );
  }

  protected readonly Config = Config;
}
