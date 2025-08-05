import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurriculumVitae {

  private CVApiURL: string = `${environment.DOCUMENTS_API_URL}/cv/upload`;

  constructor(private http: HttpClient) { }

  uploadCV(file: File, applicantId: string): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('applicant_id', applicantId);

    return this.http.post(this.CVApiURL, formData);
  }
}
