import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { NgIcon } from '@ng-icons/core';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
interface Message {
  text: string;
  icon?: string;
  loading?: boolean;
}
@Component({
  selector: 'app-message',
  standalone: true,
  imports: [NgIcon, NgIf, CommonModule],
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
})
export class MessageComponent implements OnInit, OnDestroy {
  message: Message = {
    text: '',
  };
  opened = false;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.setMessage.subscribe((message) => {
      if (message != null) {
        console.log(message.text);
        this.message.text = message.text;
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
