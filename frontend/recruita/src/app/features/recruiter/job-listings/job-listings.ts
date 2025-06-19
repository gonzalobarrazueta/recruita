import { Component } from '@angular/core';
import { JobPosting } from '../../../models/job-posting';

@Component({
  selector: 'app-job-listings',
  imports: [],
  templateUrl: './job-listings.html',
  styleUrl: './job-listings.scss'
})
export class JobListings {

  jobPostings: JobPosting[] = [];
}
