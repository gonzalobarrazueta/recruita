import { Injectable } from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Agent {

  private agentApiURL: string = `${environment.AGENT_API_URL}/ask`;

  constructor(private http: HttpClient) { }

  askAgent(userInput: string, jobDescription: string, conversationId: string): Observable<{ response: string }> {
    const payload = {
      user_input: userInput,
      job_description: jobDescription,
      conversation_id: conversationId
    }
    return this.http.post<{ response: string }>(this.agentApiURL, payload);
  }
}
