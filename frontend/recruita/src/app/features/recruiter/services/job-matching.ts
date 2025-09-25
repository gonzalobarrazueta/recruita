import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobMatching {

  private jobMatchingApiURL: string = `${environment.DOCUMENTS_API_URL}/matches`;

  constructor(private http: HttpClient) { }

  getJobMatchesByJobPosting(jobPostingId: string) {
    return this.http.get(`${this.jobMatchingApiURL}/${jobPostingId}`);
  }
}
