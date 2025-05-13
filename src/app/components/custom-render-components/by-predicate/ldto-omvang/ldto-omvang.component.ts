import { Component, OnInit } from '@angular/core';
import { humanFileSize } from '../../../../helpers/util.helper';
import { PredicateRenderComponent } from '../predicate-render-component.directive';

interface LdtoOmvangData {
  bytesStr?: string;
}

@Component({
  selector: 'app-ldto-omvang',
  standalone: true,
  imports: [],
  templateUrl: './ldto-omvang.component.html',
  styleUrl: './ldto-omvang.component.scss',
})
export class LdtoOmvangComponent
  extends PredicateRenderComponent<LdtoOmvangData>
  implements OnInit
{
  humanReadableBytesStr: string = '';

  ngOnInit() {
    this.initHumanReadableBytesStr();
  }

  initHumanReadableBytesStr() {
    if (!this.data?.bytesStr) {
      this.humanReadableBytesStr = this.data?.bytesStr ?? '';
      return;
    }

    const bytes: number = parseInt(this.data.bytesStr);
    this.humanReadableBytesStr = humanFileSize(bytes, true, 2);
  }
}
