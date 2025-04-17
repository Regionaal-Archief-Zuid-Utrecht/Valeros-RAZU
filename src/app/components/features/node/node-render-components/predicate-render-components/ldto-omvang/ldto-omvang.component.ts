import { Component, Input, OnInit } from '@angular/core';
import { humanFileSize } from '../../../../../../helpers/util.helper';

@Component({
  selector: 'app-ldto-omvang',
  standalone: true,
  imports: [],
  templateUrl: './ldto-omvang.component.html',
  styleUrl: './ldto-omvang.component.scss',
})
export class LdtoOmvangComponent implements OnInit {
  @Input() bytesStr?: string;
  humanReadableBytesStr: string = '';

  ngOnInit() {
    this.initHumanReadableBytesStr();
  }

  initHumanReadableBytesStr() {
    if (!this.bytesStr) {
      this.humanReadableBytesStr = this.bytesStr ?? '';
      return;
    }

    const bytes: number = parseInt(this.bytesStr);
    this.humanReadableBytesStr = humanFileSize(bytes, true, 2);
  }
}
