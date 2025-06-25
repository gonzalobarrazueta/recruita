import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {map, Observable} from 'rxjs';
import {JobPosting} from '../../models/job-posting';

@Injectable({
  providedIn: 'root'
})
export class Jobs {

  private documentsApiURL: string = environment.DOCUMENTS_API_URL;

  constructor(private http: HttpClient) {

  }

  getJobs(): Observable<JobPosting[]> {
    return this.http.get<any[]>(`${this.documentsApiURL}/documents/job-postings`)
      .pipe(
        map(jobs =>
          jobs.map(
            job => ({
              id: job.id,
              recruiterId: job.recruiter_id,
              title: job.title,
              yearsOfExperience: job.years_of_experience,
              category: job.category,
              companyName: job.company_name,
              companyImage: job.company_image,
              requirements: job.requirements,
              fullDescription: job.fullDescription
            })
          )
        )
      );
  }

  getJobsByRecruiterId(recruiterId: string): Observable<JobPosting[]> {
    return this.http.get<any[]>(`${this.documentsApiURL}/documents/job-postings/recruiter/${recruiterId}`)
      .pipe(
        map(jobs =>
          jobs.map(
            job => ({
              id: job.id,
              recruiterId: job.recruiter_id,
              title: job.title,
              yearsOfExperience: job.years_of_experience,
              category: job.category,
              companyName: job.company_name,
              companyImage: job.company_image,
              requirements: job.requirements,
              fullDescription: job.fullDescription
            })
          )
        )
      );
  }
}
