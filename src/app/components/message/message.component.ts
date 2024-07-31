import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { OriginalRecordService } from '../../services/originalrecord.service';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  @Input() message: string = '';
  opened = false;

  constructor(private originalRecordService: OriginalRecordService) {}

  ngOnInit(): void {
    this.originalRecordService.setMessage.subscribe((message) => {
      if (message != null) {
        this.message = message;
        this.openMessage();
      } else {
        this.closeMessage();
      }
    });
  }

  ngOnDestroy(): void {}

  openMessage(): void {
    this.opened = true;
  }
  closeMessage(): void {
    this.opened = false;
  }
}
