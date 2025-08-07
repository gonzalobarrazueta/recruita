import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Message} from '../../models/message';

@Injectable({
  providedIn: 'root'
})
export class ConversationMessages {

  constructor(private http: HttpClient) { }

  getConversation(userId: string, jobPostingId: string) {
    return this.http.get(`${environment.AGENT_API_URL}/conversations/${userId}/${jobPostingId}`);
  }

  createMessage(message: Message) {
    return this.http.post(`${environment.AGENT_API_URL}/messages`, message);
  }
}
