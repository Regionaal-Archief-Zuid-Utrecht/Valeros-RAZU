import { Component, Input } from '@angular/core';
import { TypeRenderComponentInput } from '../../../models/type-render-component-input.model';

@Component({
  selector: 'app-type-render-component',
  standalone: true,
  imports: [],
  template: '',
})
export class TypeRenderComponent {
  @Input() data?: TypeRenderComponentInput;
}
