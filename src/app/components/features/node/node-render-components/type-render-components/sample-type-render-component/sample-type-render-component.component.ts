import { Component, type OnInit } from '@angular/core';
import { NodeRenderComponent } from '../../node-render.component';

@Component({
  selector: 'app-sample-type-render-component',
  standalone: true,
  imports: [],
  templateUrl: './sample-type-render-component.component.html',
  styleUrl: './sample-type-render-component.component.css',
})
export class SampleTypeRenderComponentComponent
  extends NodeRenderComponent
  implements OnInit
{
  ngOnInit(): void {}
}
