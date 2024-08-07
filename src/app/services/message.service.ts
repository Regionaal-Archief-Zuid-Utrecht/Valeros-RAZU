import { Injectable, EventEmitter } from '@angular/core';

interface Message {
  text: string;
  icon?: string;
  loading?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  setMessage = new EventEmitter<any>();

  constructor() {}

  sendMessage(
    message: string,
    timed: boolean,
    seconds?: number,
    icon?: string,
    loading?: boolean,
  ) {
    const messageToSend: Message = {
      text: message,
    };
    if (icon) {
      messageToSend.icon = icon;
    }
    if (loading) {
      messageToSend.loading = loading;
    }
    this.setMessage.emit(messageToSend);
    if (timed) {
      if (!seconds) {
        console.log(
          'Error, timed message without duration sent. Defaulting to 5 seconds.',
        );
        seconds = 5;
      }
      this.waitTimer(seconds).then(() => {
        this.destroyMessage();
      });
    }
  }

  destroyMessage() {
    this.setMessage.emit(null);
  }

  waitTimer(seconds: number) {
    const timer = seconds * 1000;
    return new Promise((resolve) => setTimeout(resolve, timer));
  }
}
