import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConversationMessages {

  constructor(private http: HttpClient) { }

  getConversation(userId: string, jobPostingId: string) {
    return this.http.get(`${environment.AGENT_API_URL}/conversations/${userId}/${jobPostingId}`);
  }
}
