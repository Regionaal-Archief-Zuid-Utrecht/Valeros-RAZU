import { Component, Input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-search-tip',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './search-tip.component.html',
  styleUrls: ['./search-tip.component.scss'],
})
export class SearchTipComponent {
  @Input() title: string = '';
  @Input() description: string = '';
}
