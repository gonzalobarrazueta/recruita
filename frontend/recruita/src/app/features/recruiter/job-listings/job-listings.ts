import { Component } from '@angular/core';
import { JobPosting } from '../../../models/job-posting';
import { Auth } from '../../auth/services/auth';
import { Jobs } from '../../../shared/services/jobs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-job-listings',
  imports: [
    RouterLink
  ],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.scss'
})
export class JobListings {

  jobPostings: JobPosting[] = [];

  constructor(private authService: Auth, private jobsService: Jobs) {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.jobsService.getJobsByRecruiterId(user.id)
          .subscribe(jobs => {
            this.jobPostings = jobs
            console.log(this.jobPostings)
          });
      } else {
        console.error('JobListings component: No user found');
      }
    })
  }
}
