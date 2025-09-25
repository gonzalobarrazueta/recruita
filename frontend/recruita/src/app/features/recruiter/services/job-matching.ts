import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {EnvVarsConfig} from '../../../shared/services/env-vars-config';

@Injectable({
  providedIn: 'root'
})
export class JobMatching {

  private jobMatchingApiURL: string = "";

  constructor(private http: HttpClient, private envVarsConfig: EnvVarsConfig) { }

  ngOnInit() {
    this.jobMatchingApiURL = `${this.envVarsConfig.DOCUMENTS_API_URL}/matches`;
  }

  getJobMatchesByJobPosting(jobPostingId: string) {
    return this.http.get(`${this.jobMatchingApiURL}/${jobPostingId}`);
  }
}
