import { Component, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HeaderComponent, HeaderView } from '../../ui/header/header.component';
import { ViewContainerComponent } from '../view-container/view-container.component';

@Component({
  selector: 'app-accessibility-evaluation',
  imports: [ViewContainerComponent, HeaderComponent, RouterLink],
  templateUrl: './accessibility-evaluation.component.html',
  styleUrl: './acccessibility-evaluation.component.scss',

  standalone: true,
})
export class AccessibilityEvaluationComponent implements OnInit {
  ngOnInit(): void {}

  protected readonly HeaderView = HeaderView;
}
