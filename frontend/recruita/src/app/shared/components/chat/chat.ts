import { Component } from '@angular/core';
import { Message } from '../../../models/message';

@Component({
  selector: 'app-chat',
  imports: [],
  templateUrl: './chat.html',
  styleUrl: './chat.scss'
})
export class Chat {

  messages: Message[] = [];
}
